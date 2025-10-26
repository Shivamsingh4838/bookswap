const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Book = require('../models/Book');
const BookRequest = require('../models/BookRequest');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// @route   GET /api/books
// @desc    Get all books
// @access  Public
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({ isAvailable: true })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(books);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/books/my-books
// @desc    Get current user's books
// @access  Private
router.get('/my-books', auth, async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user._id })
      .sort({ createdAt: -1 });
    console.log("books :",books);
    
    res.json(books);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/books
// @desc    Create a new book
// @access  Private
router.post('/', auth, upload.single('image'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('condition').isIn(['Excellent', 'Good', 'Fair', 'Poor']).withMessage('Invalid condition')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, condition, description, category } = req.body;
    const image = req.file ? req.file.filename : '';

    const book = new Book({
      title,
      author,
      condition,
      description,
      category,
      image,
      owner: req.user._id
    });

    await book.save();
    await book.populate('owner', 'name email');

    res.status(201).json(book);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/books/:id
// @desc    Update a book
// @access  Private
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, author, condition, description, category } = req.body;
    const image = req.file ? req.file.filename : book.image;

    book.title = title || book.title;
    book.author = author || book.author;
    book.condition = condition || book.condition;
    book.description = description || book.description;
    book.category = category || book.category;
    book.image = image;

    await book.save();
    await book.populate('owner', 'name email');

    res.json(book);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete all requests for this book
    await BookRequest.deleteMany({ book: book._id });

    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/books/:id
// @desc    Get a single book
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('owner', 'name email');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
