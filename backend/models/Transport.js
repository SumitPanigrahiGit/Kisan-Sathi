const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupLocation: {
    address: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: String
  },
  dropLocation: {
    address: { type: String, required: true },
    district: String,
    state: String,
    pincode: String
  },
  commodity: {
    type: String,
    required: true
  },
  quantity: {
    value: { type: Number, required: true },
    unit: { type: String, default: 'Quintal' }
  },
  vehicleType: {
    type: String,
    enum: ['Mini Truck', 'Medium Truck', 'Large Truck', 'Tractor', 'Tempo'],
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  estimatedCost: Number,
  actualCost: Number,
  provider: {
    name: String,
    phone: String,
    vehicleNumber: String
  },
  notes: String,
  contactPhone: String
}, { timestamps: true });

module.exports = mongoose.model('Transport', transportSchema);
