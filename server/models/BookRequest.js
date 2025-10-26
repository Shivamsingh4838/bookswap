const mongoose = require('mongoose');

const bookRequestSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true
  },
  responseMessage: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Ensure one request per book per user
bookRequestSchema.index({ book: 1, requester: 1 }, { unique: true });

module.exports = mongoose.model('BookRequest', bookRequestSchema);
