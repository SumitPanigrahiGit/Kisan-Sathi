const express = require('express');
const router = express.Router();
const Transport = require('../models/Transport');
const { protect } = require('../middleware/auth');

// @POST /api/transport/request
router.post('/request', protect, async (req, res) => {
  try {
    const {
      pickupLocation,
      dropLocation,
      commodity,
      quantity,
      vehicleType,
      scheduledDate,
      contactPhone,
      notes
    } = req.body;

    if (!pickupLocation || !dropLocation || !commodity || !quantity || !vehicleType || !scheduledDate) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Estimate cost based on vehicle type and approximate distance
    const costMap = { 'Mini Truck': 2500, 'Tempo': 1800, 'Tractor': 1500, 'Medium Truck': 4000, 'Large Truck': 6000 };
    const estimatedCost = costMap[vehicleType] || 3000;

    const transport = await Transport.create({
      farmer: req.user._id,
      pickupLocation,
      dropLocation,
      commodity,
      quantity,
      vehicleType,
      scheduledDate: new Date(scheduledDate),
      estimatedCost,
      contactPhone: contactPhone || req.user.phone,
      notes,
      provider: {
        name: 'Auto-Assigned',
        phone: 'TBD',
        vehicleNumber: 'TBD'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Transport request submitted successfully. Provider will contact you shortly.',
      transport
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating transport request' });
  }
});

// @GET /api/transport/my-requests
router.get('/my-requests', protect, async (req, res) => {
  try {
    const requests = await Transport.find({ farmer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transport requests' });
  }
});

// @GET /api/transport/providers
router.get('/providers', async (req, res) => {
  const providers = [
    { name: 'Rajan Logistics', phone: '9876543210', rating: 4.5, vehicles: ['Mini Truck', 'Medium Truck'], areas: ['Punjab', 'Haryana', 'UP'], pricePerKm: 25 },
    { name: 'Krishna Transport', phone: '9765432109', rating: 4.2, vehicles: ['Large Truck', 'Medium Truck'], areas: ['Maharashtra', 'MP', 'Gujarat'], pricePerKm: 22 },
    { name: 'Balaji Roadways', phone: '9654321098', rating: 4.7, vehicles: ['Tractor', 'Mini Truck'], areas: ['AP', 'Telangana', 'Karnataka'], pricePerKm: 20 },
    { name: 'Ganga Transport Co.', phone: '9543210987', rating: 4.1, vehicles: ['Medium Truck', 'Large Truck'], areas: ['Bihar', 'UP', 'West Bengal'], pricePerKm: 23 },
    { name: 'Aravalli Carriers', phone: '9432109876', rating: 4.4, vehicles: ['Tempo', 'Mini Truck'], areas: ['Rajasthan', 'Gujarat', 'MP'], pricePerKm: 21 },
    { name: 'Deccan Agri Logistics', phone: '9321098765', rating: 4.6, vehicles: ['Mini Truck', 'Tractor', 'Medium Truck'], areas: ['Karnataka', 'Maharashtra', 'AP'], pricePerKm: 24 }
  ];
  res.json({ success: true, providers });
});

// @PUT /api/transport/:id/cancel
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const transport = await Transport.findOne({ _id: req.params.id, farmer: req.user._id });
    if (!transport) return res.status(404).json({ message: 'Transport request not found' });

    if (['In Transit', 'Delivered'].includes(transport.status)) {
      return res.status(400).json({ message: 'Cannot cancel a request that is already in transit or delivered' });
    }

    transport.status = 'Cancelled';
    await transport.save();

    res.json({ success: true, message: 'Transport request cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling request' });
  }
});

module.exports = router;
