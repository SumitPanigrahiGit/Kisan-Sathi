const mongoose = require('mongoose');

const mandiRateSchema = new mongoose.Schema({
  commodity: {
    type: String,
    required: true,
    trim: true
  },
  market: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  minPrice: {
    type: Number,
    required: true
  },
  maxPrice: {
    type: Number,
    required: true
  },
  modalPrice: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'Quintal'
  },
  arrivalDate: {
    type: Date,
    default: Date.now
  },
  variety: String,
  grade: String,
  trend: {
    type: String,
    enum: ['up', 'down', 'stable'],
    default: 'stable'
  },
  changePercent: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('MandiRate', mandiRateSchema);
