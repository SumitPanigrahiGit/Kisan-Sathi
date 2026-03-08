const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  localNames: {
    hindi: String,
    punjabi: String,
    marathi: String,
    telugu: String,
    tamil: String
  },
  category: {
    type: String,
    enum: ['Cereal', 'Pulse', 'Oilseed', 'Vegetable', 'Fruit', 'Cash Crop', 'Spice', 'Fiber'],
    required: true
  },
  season: {
    type: String,
    enum: ['Kharif', 'Rabi', 'Zaid', 'Year-round'],
    required: true
  },
  duration: {
    type: String,
    default: '90-120 days'
  },
  soilType: [String],
  soilPH: {
    min: Number,
    max: Number
  },
  climate: {
    temperature: String,
    rainfall: String,
    humidity: String
  },
  irrigation: {
    method: [String],
    frequency: String,
    waterRequirement: String
  },
  fertilizer: {
    basal: String,
    topDressing: [String],
    organic: String,
    schedule: [{ stage: String, fertilizer: String, quantity: String }]
  },
  pests: [{
    name: String,
    symptoms: String,
    control: String,
    pesticide: String
  }],
  diseases: [{
    name: String,
    symptoms: String,
    control: String,
    fungicide: String
  }],
  harvesting: {
    indicators: String,
    method: String,
    yield: String
  },
  marketPrice: {
    msp: Number,
    unit: String
  },
  image: String,
  states: [String],
  tips: [String]
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
