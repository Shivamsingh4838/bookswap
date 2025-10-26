const express = require('express');
const { body, validationResult } = require('express-validator');
const BookRequest = require('../models/BookRequest');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/requests
// @desc    Create a book request
// @access  Private
router.post('/', auth, [
  body('bookId').notEmpty().withMessage('Book ID is required'),
  body('message').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookId, message } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.isAvailable) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    if (book.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot request your own book' });
    }

    // Check if request already exists
    const existingRequest = await BookRequest.findOne({
      book: bookId,
      requester: req.user._id
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already exists for this book' });
    }

    const bookRequest = new BookRequest({
      book: bookId,
      requester: req.user._id,
      owner: book.owner,
      message
    });

    await bookRequest.save();
    await bookRequest.populate([
      { path: 'book', populate: { path: 'owner', select: 'name email' } },
      { path: 'requester', select: 'name email' },
      { path: 'owner', select: 'name email' }
    ]);

    res.status(201).json(bookRequest);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/requests/sent
// @desc    Get requests sent by current user
// @access  Private
router.get('/sent', auth, async (req, res) => {
  try {
    const requests = await BookRequest.find({ requester: req.user._id })
      .populate([
        { path: 'book', populate: { path: 'owner', select: 'name email' } },
        { path: 'requester', select: 'name email' },
        { path: 'owner', select: 'name email' }
      ])
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/requests/received
// @desc    Get requests received by current user
// @access  Private
router.get('/received', auth, async (req, res) => {
  try {
    const requests = await BookRequest.find({ owner: req.user._id })
      .populate([
        { path: 'book', populate: { path: 'owner', select: 'name email' } },
        { path: 'requester', select: 'name email' },
        { path: 'owner', select: 'name email' }
      ])
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/requests/:id/respond
// @desc    Respond to a book request (accept/decline)
// @access  Private
router.put('/:id/respond', auth, [
  body('status').isIn(['accepted', 'declined']).withMessage('Status must be accepted or declined'),
  body('responseMessage').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, responseMessage } = req.body;

    const request = await BookRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request has already been responded to' });
    }

    request.status = status;
    request.responseMessage = responseMessage;

    // If accepted, mark book as unavailable
    if (status === 'accepted') {
      await Book.findByIdAndUpdate(request.book, { isAvailable: false });
    }

    await request.save();
    await request.populate([
      { path: 'book', populate: { path: 'owner', select: 'name email' } },
      { path: 'requester', select: 'name email' },
      { path: 'owner', select: 'name email' }
    ]);

    res.json(request);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/requests/:id
// @desc    Cancel a book request
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const request = await BookRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel a request that has been responded to' });
    }

    await BookRequest.findByIdAndDelete(req.params.id);

    res.json({ message: 'Request cancelled successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
