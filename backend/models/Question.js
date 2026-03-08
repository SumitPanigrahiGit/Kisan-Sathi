const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isExpertAnswer: {
    type: Boolean,
    default: false
  },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isAccepted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const questionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true,
    minlength: [10, 'Title must be at least 10 characters']
  },
  content: {
    type: String,
    required: [true, 'Question content is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Crop Disease', 'Irrigation', 'Fertilizer', 'Pest Control', 'Market Price', 'Weather', 'Soil', 'Government Scheme', 'Other'],
    default: 'Other'
  },
  crop: String,
  tags: [String],
  language: {
    type: String,
    default: 'English'
  },
  images: [String],
  answers: [answerSchema],
  views: {
    type: Number,
    default: 0
  },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isResolved: {
    type: Boolean,
    default: false
  },
  district: String,
  state: String
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
