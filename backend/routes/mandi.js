const express = require('express');
const router = express.Router();
const MandiRate = require('../models/MandiRate');

// Seed mandi data
const seedMandiRates = async () => {
  const count = await MandiRate.countDocuments();
  if (count > 0) return;

  const states = ['Punjab', 'Haryana', 'UP', 'Rajasthan', 'MP', 'Maharashtra', 'Bihar', 'Gujarat'];
  const markets = {
    Punjab: ['Amritsar', 'Ludhiana', 'Patiala', 'Jalandhar'],
    Haryana: ['Ambala', 'Hisar', 'Karnal', 'Rohtak'],
    UP: ['Agra', 'Lucknow', 'Varanasi', 'Meerut'],
    Rajasthan: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner'],
    MP: ['Bhopal', 'Indore', 'Gwalior', 'Ujjain'],
    Maharashtra: ['Pune', 'Nashik', 'Nagpur', 'Kolhapur'],
    Bihar: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur'],
    Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot']
  };

  const commodityPrices = {
    'Wheat': { min: 2100, max: 2500, modal: 2275, trend: 'stable' },
    'Rice': { min: 1900, max: 2600, modal: 2183, trend: 'up' },
    'Maize': { min: 1700, max: 2200, modal: 1962, trend: 'up' },
    'Mustard': { min: 5200, max: 6100, modal: 5650, trend: 'down' },
    'Soybean': { min: 4200, max: 5000, modal: 4600, trend: 'stable' },
    'Cotton': { min: 6000, max: 7200, modal: 6620, trend: 'up' },
    'Sugarcane': { min: 290, max: 340, modal: 315, trend: 'stable' },
    'Tomato': { min: 400, max: 1800, modal: 900, trend: 'up' },
    'Onion': { min: 600, max: 2200, modal: 1200, trend: 'down' },
    'Potato': { min: 400, max: 1200, modal: 700, trend: 'stable' },
    'Gram': { min: 4800, max: 5500, modal: 5100, trend: 'up' },
    'Arhar Dal': { min: 6500, max: 7200, modal: 6890, trend: 'down' }
  };

  const rates = [];
  const today = new Date();

  for (const [state, cityList] of Object.entries(markets)) {
    for (const market of cityList) {
      for (const [commodity, price] of Object.entries(commodityPrices)) {
        const variation = (Math.random() - 0.5) * 0.1;
        const baseModal = Math.round(price.modal * (1 + variation));
        const minP = Math.round(baseModal * 0.92);
        const maxP = Math.round(baseModal * 1.08);
        const changePct = parseFloat((variation * 100).toFixed(2));

        rates.push({
          commodity,
          market,
          district: market,
          state,
          minPrice: minP,
          maxPrice: maxP,
          modalPrice: baseModal,
          unit: 'Quintal',
          arrivalDate: today,
          trend: price.trend,
          changePercent: changePct
        });
      }
    }
  }

  await MandiRate.insertMany(rates);
  console.log('Mandi rates seed data inserted');
};

seedMandiRates().catch(console.error);

// @GET /api/mandi/rates
router.get('/rates', async (req, res) => {
  try {
    const { state, district, commodity, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (state) filter.state = state;
    if (district) filter.district = district;
    if (commodity) filter.commodity = { $regex: commodity, $options: 'i' };

    const skip = (page - 1) * limit;
    const total = await MandiRate.countDocuments(filter);
    const rates = await MandiRate.find(filter)
      .sort({ arrivalDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ success: true, total, rates });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mandi rates' });
  }
});

// @GET /api/mandi/states
router.get('/states', async (req, res) => {
  try {
    const states = await MandiRate.distinct('state');
    res.json({ success: true, states });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});

// @GET /api/mandi/commodities
router.get('/commodities', async (req, res) => {
  try {
    const commodities = await MandiRate.distinct('commodity');
    res.json({ success: true, commodities });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});

// @GET /api/mandi/markets
router.get('/markets', async (req, res) => {
  try {
    const { state } = req.query;
    const filter = {};
    if (state) filter.state = state;
    const markets = await MandiRate.distinct('market', filter);
    res.json({ success: true, markets });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});

// @GET /api/mandi/top-movers
router.get('/top-movers', async (req, res) => {
  try {
    const gainers = await MandiRate.find({ trend: 'up' })
      .sort({ changePercent: -1 })
      .limit(5);
    const losers = await MandiRate.find({ trend: 'down' })
      .sort({ changePercent: 1 })
      .limit(5);

    res.json({ success: true, gainers, losers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top movers' });
  }
});

module.exports = router;
