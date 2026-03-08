const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const { protect } = require('../middleware/auth');

// Seed initial crop data
const seedCrops = async () => {
  const count = await Crop.countDocuments();
  if (count > 0) return;

  const crops = [
    {
      name: 'Wheat',
      localNames: { hindi: 'गेहूं', punjabi: 'ਕਣਕ', marathi: 'गहू' },
      category: 'Cereal',
      season: 'Rabi',
      duration: '120-150 days',
      soilType: ['Loamy', 'Clay Loam', 'Well-drained'],
      soilPH: { min: 6.0, max: 7.5 },
      climate: { temperature: '10-25°C', rainfall: '30-100 cm', humidity: '50-70%' },
      irrigation: { method: ['Furrow', 'Sprinkler'], frequency: 'Every 20-25 days', waterRequirement: '400-500 mm' },
      fertilizer: {
        basal: 'DAP 50 kg/acre + MOP 25 kg/acre',
        topDressing: ['Urea 25 kg/acre at tillering', 'Urea 25 kg/acre at jointing'],
        organic: 'FYM 4-5 tonnes/acre',
        schedule: [
          { stage: 'Sowing', fertilizer: 'DAP + MOP', quantity: '50 kg + 25 kg/acre' },
          { stage: 'Tillering (25-30 days)', fertilizer: 'Urea', quantity: '25 kg/acre' },
          { stage: 'Jointing (45 days)', fertilizer: 'Urea', quantity: '25 kg/acre' }
        ]
      },
      pests: [
        { name: 'Aphids', symptoms: 'Yellowing leaves, stunted growth', control: 'Spray Imidacloprid 17.8 SL', pesticide: 'Imidacloprid 0.5 ml/L' },
        { name: 'Termites', symptoms: 'Wilting plants, hollow stems', control: 'Soil treatment with Chlorpyriphos', pesticide: 'Chlorpyriphos 2 ml/L' }
      ],
      diseases: [
        { name: 'Yellow Rust', symptoms: 'Yellow stripes on leaves', control: 'Spray Propiconazole', fungicide: 'Propiconazole 1 ml/L' },
        { name: 'Loose Smut', symptoms: 'Black spores replacing grain', control: 'Seed treatment with Carboxin', fungicide: 'Carboxin 2 g/kg seed' }
      ],
      harvesting: { indicators: 'Grains hard, golden yellow color', method: 'Combine harvester or manual', yield: '15-20 quintals/acre' },
      marketPrice: { msp: 2275, unit: 'Quintal' },
      states: ['Punjab', 'Haryana', 'UP', 'MP', 'Rajasthan'],
      tips: ['Sow in October-November for best yield', 'Use certified seed for better germination', 'First irrigation at crown root initiation stage is critical'],
      image: 'wheat'
    },
    {
      name: 'Rice',
      localNames: { hindi: 'धान', marathi: 'भात', telugu: 'వరి', tamil: 'நெல்' },
      category: 'Cereal',
      season: 'Kharif',
      duration: '90-150 days',
      soilType: ['Clay', 'Clay Loam', 'Silty Clay'],
      soilPH: { min: 5.5, max: 7.0 },
      climate: { temperature: '20-35°C', rainfall: '100-200 cm', humidity: '80-85%' },
      irrigation: { method: ['Flood', 'SRI', 'AWD'], frequency: 'Maintain 5cm water in field', waterRequirement: '1000-2000 mm' },
      fertilizer: {
        basal: 'SSP 100 kg/acre + MOP 33 kg/acre',
        topDressing: ['Urea 33 kg/acre at transplanting+7 days', 'Urea 33 kg/acre at panicle initiation'],
        organic: 'Green manure or FYM 4 tonnes/acre',
        schedule: [
          { stage: 'Transplanting', fertilizer: 'SSP + MOP', quantity: '100 kg + 33 kg/acre' },
          { stage: '7 days after transplanting', fertilizer: 'Urea', quantity: '33 kg/acre' },
          { stage: 'Panicle Initiation', fertilizer: 'Urea', quantity: '33 kg/acre' }
        ]
      },
      pests: [
        { name: 'Stem Borer', symptoms: 'Dead heart in vegetative stage, white ear in reproductive stage', control: 'Spray Chlorpyriphos + Cypermethrin', pesticide: 'Chlorpyriphos 2.5 ml/L' },
        { name: 'Brown Plant Hopper', symptoms: 'Hopper burn, circular dead patches', control: 'Spray Buprofezin or Imidacloprid', pesticide: 'Imidacloprid 0.5 ml/L' }
      ],
      diseases: [
        { name: 'Blast', symptoms: 'Diamond-shaped lesions on leaves', control: 'Spray Tricyclazole', fungicide: 'Tricyclazole 0.6 g/L' },
        { name: 'Bacterial Leaf Blight', symptoms: 'Water-soaked lesions on leaf margins', control: 'Spray Streptocycline + Copper oxychloride', fungicide: 'Streptocycline 0.5 g + COC 3 g/L' }
      ],
      harvesting: { indicators: 'Grains fully filled, 80% straw yellow', method: 'Combine harvester or sickle', yield: '18-25 quintals/acre' },
      marketPrice: { msp: 2183, unit: 'Quintal' },
      states: ['West Bengal', 'UP', 'Punjab', 'AP', 'Odisha', 'Bihar'],
      tips: ['Maintain proper water level throughout crop growth', 'Transplant 20-25 day old seedlings', 'Use Zinc sulfate if zinc deficiency observed'],
      image: 'rice'
    },
    {
      name: 'Cotton',
      localNames: { hindi: 'कपास', telugu: 'పత్తి', marathi: 'कापूस', tamil: 'பருத்தி' },
      category: 'Cash Crop',
      season: 'Kharif',
      duration: '150-180 days',
      soilType: ['Black Cotton Soil', 'Deep Alluvial', 'Sandy Loam'],
      soilPH: { min: 6.0, max: 8.0 },
      climate: { temperature: '21-30°C', rainfall: '50-100 cm', humidity: '40-60%' },
      irrigation: { method: ['Drip', 'Furrow'], frequency: 'Every 10-15 days in dry period', waterRequirement: '700-1200 mm' },
      fertilizer: {
        basal: 'DAP 50 kg/acre + MOP 25 kg/acre + Sulfur 10 kg/acre',
        topDressing: ['Urea 35 kg/acre at 30 days', 'Urea 35 kg/acre at boll formation'],
        organic: 'Neem cake 100 kg/acre',
        schedule: [
          { stage: 'Sowing', fertilizer: 'DAP + MOP', quantity: '50 kg + 25 kg/acre' },
          { stage: '30 days', fertilizer: 'Urea', quantity: '35 kg/acre' },
          { stage: 'Boll Formation', fertilizer: 'Urea + Potash', quantity: '35 kg + 15 kg/acre' }
        ]
      },
      pests: [
        { name: 'Bollworm', symptoms: 'Entry holes in bolls, damaged seeds', control: 'Spray Spinosad or Emamectin benzoate', pesticide: 'Emamectin 0.5 g/L' },
        { name: 'Whitefly', symptoms: 'Yellowing, leaf curl, honeydew', control: 'Spray Thiamethoxam', pesticide: 'Thiamethoxam 0.2 g/L' }
      ],
      diseases: [
        { name: 'Fusarium Wilt', symptoms: 'Yellowing and wilting of plants', control: 'Seed treatment with Trichoderma', fungicide: 'Trichoderma 4 g/kg seed' }
      ],
      harvesting: { indicators: 'Bolls fully open, white lint visible', method: 'Manual picking', yield: '8-15 quintals/acre' },
      marketPrice: { msp: 6620, unit: 'Quintal' },
      states: ['Gujarat', 'Maharashtra', 'Telangana', 'AP', 'Punjab', 'Haryana'],
      tips: ['Use Bt cotton seeds for bollworm resistance', 'Drip irrigation saves 30-40% water', 'Pick cotton in dry weather to maintain quality'],
      image: 'cotton'
    },
    {
      name: 'Maize',
      localNames: { hindi: 'मक्का', marathi: 'मका', telugu: 'మొక్కజొన్న' },
      category: 'Cereal',
      season: 'Kharif',
      duration: '80-95 days',
      soilType: ['Loamy', 'Sandy Loam', 'Well-drained'],
      soilPH: { min: 5.8, max: 7.0 },
      climate: { temperature: '18-32°C', rainfall: '50-100 cm', humidity: '60-70%' },
      irrigation: { method: ['Sprinkler', 'Furrow', 'Drip'], frequency: 'Every 8-10 days', waterRequirement: '500-800 mm' },
      fertilizer: {
        basal: 'DAP 50 kg/acre',
        topDressing: ['Urea 33 kg/acre at knee-high stage', 'Urea 33 kg/acre at tasseling'],
        organic: 'FYM 5 tonnes/acre',
        schedule: [
          { stage: 'Sowing', fertilizer: 'DAP', quantity: '50 kg/acre' },
          { stage: 'Knee-high (30 days)', fertilizer: 'Urea', quantity: '33 kg/acre' },
          { stage: 'Tasseling (50 days)', fertilizer: 'Urea', quantity: '33 kg/acre' }
        ]
      },
      pests: [
        { name: 'Fall Army Worm', symptoms: 'Ragged leaf feeding, frass on whorl', control: 'Spray Spinetoram or Chlorantraniliprole', pesticide: 'Spinetoram 0.5 ml/L' }
      ],
      diseases: [
        { name: 'Turcicum Leaf Blight', symptoms: 'Cigar-shaped lesions on leaves', control: 'Spray Mancozeb', fungicide: 'Mancozeb 2.5 g/L' }
      ],
      harvesting: { indicators: 'Husks dry, black layer at kernel base', method: 'Manual or combine', yield: '20-30 quintals/acre' },
      marketPrice: { msp: 1962, unit: 'Quintal' },
      states: ['Karnataka', 'MP', 'Bihar', 'Rajasthan', 'UP', 'Himachal Pradesh'],
      tips: ['Plant at 75x25 cm spacing for optimal yield', 'Weed control in first 30 days is critical', 'Harvest at 25% moisture for better storage'],
      image: 'maize'
    },
    {
      name: 'Sugarcane',
      localNames: { hindi: 'गन्ना', marathi: 'ऊस', tamil: 'கரும்பு', telugu: 'చెరకు' },
      category: 'Cash Crop',
      season: 'Year-round',
      duration: '12-18 months',
      soilType: ['Loamy', 'Well-drained', 'Deep Alluvial'],
      soilPH: { min: 6.0, max: 7.5 },
      climate: { temperature: '20-35°C', rainfall: '75-150 cm', humidity: '70-80%' },
      irrigation: { method: ['Drip', 'Furrow', 'Flood'], frequency: 'Every 7-10 days in summer', waterRequirement: '1500-2500 mm' },
      fertilizer: {
        basal: 'Phosphate 100 kg/acre + Potash 80 kg/acre',
        topDressing: ['Urea 50 kg/acre at 30 days', 'Urea 50 kg/acre at 90 days', 'Urea 25 kg/acre at 150 days'],
        organic: 'Pressmud 4 tonnes/acre or FYM 10 tonnes/acre',
        schedule: [
          { stage: 'Planting', fertilizer: 'SSP + MOP', quantity: '200 kg + 80 kg/acre' },
          { stage: '30 days', fertilizer: 'Urea', quantity: '50 kg/acre' },
          { stage: '90 days', fertilizer: 'Urea + Zinc', quantity: '50 kg + 10 kg/acre' }
        ]
      },
      pests: [
        { name: 'Early Shoot Borer', symptoms: 'Dead heart in young shoots', control: 'Release Trichogramma cards', pesticide: 'Fipronil 0.3 g/L if severe' }
      ],
      diseases: [
        { name: 'Red Rot', symptoms: 'Reddening inside stalk with white patches', control: 'Use disease-free setts, hot water treatment', fungicide: 'Carbendazim 1 g/L for sett treatment' }
      ],
      harvesting: { indicators: 'Brix >18%, optimum ripening, 12-14 months', method: 'Manual cutting at ground level', yield: '300-500 quintals/acre' },
      marketPrice: { msp: 315, unit: 'Quintal' },
      states: ['UP', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Haryana', 'Punjab'],
      tips: ['Use trench planting method for better yield', 'Drip irrigation with fertigation increases yield by 30%', 'Ratoon crop is economical - maintain good stubble'],
      image: 'sugarcane'
    },
    {
      name: 'Soybean',
      localNames: { hindi: 'सोयाबीन', marathi: 'सोयाबीन' },
      category: 'Oilseed',
      season: 'Kharif',
      duration: '95-110 days',
      soilType: ['Well-drained Loamy', 'Clay Loam', 'Sandy Loam'],
      soilPH: { min: 6.0, max: 7.5 },
      climate: { temperature: '20-30°C', rainfall: '60-100 cm', humidity: '60-70%' },
      irrigation: { method: ['Furrow', 'Sprinkler'], frequency: 'At critical stages only', waterRequirement: '450-700 mm' },
      fertilizer: {
        basal: 'DAP 50 kg/acre + Sulfur 20 kg/acre',
        topDressing: ['No major top dressing if Rhizobium inoculated'],
        organic: 'FYM 2-3 tonnes/acre',
        schedule: [
          { stage: 'Sowing', fertilizer: 'DAP + MOP + S', quantity: '50 kg + 17 kg + 20 kg/acre' },
          { stage: 'Seed Treatment', fertilizer: 'Rhizobium + PSB', quantity: '5 g + 5 g/kg seed' }
        ]
      },
      pests: [
        { name: 'Girdle Beetle', symptoms: 'Circular girdles on stem, stem breaking', control: 'Spray Chlorpyriphos', pesticide: 'Chlorpyriphos 2 ml/L' }
      ],
      diseases: [
        { name: 'Yellow Mosaic Virus', symptoms: 'Yellow mosaic pattern on leaves', control: 'Control whitefly vector with Imidacloprid', fungicide: 'Imidacloprid 0.5 ml/L' }
      ],
      harvesting: { indicators: 'Pods rattle, 80% pods brown', method: 'Combine or manual', yield: '6-12 quintals/acre' },
      marketPrice: { msp: 4600, unit: 'Quintal' },
      states: ['MP', 'Maharashtra', 'Rajasthan', 'Karnataka', 'Telangana'],
      tips: ['Seed inoculation with Rhizobium saves nitrogen fertilizer', 'Avoid waterlogging - very sensitive', 'Harvest promptly to avoid pod shattering'],
      image: 'soybean'
    },
    {
      name: 'Tomato',
      localNames: { hindi: 'टमाटर', marathi: 'टोमेटो', telugu: 'టమోటా', tamil: 'தக்காளி' },
      category: 'Vegetable',
      season: 'Year-round',
      duration: '70-90 days from transplanting',
      soilType: ['Sandy Loam', 'Loamy', 'Well-drained'],
      soilPH: { min: 6.0, max: 7.0 },
      climate: { temperature: '18-27°C', rainfall: '60-130 cm', humidity: '45-65%' },
      irrigation: { method: ['Drip', 'Furrow'], frequency: 'Every 4-6 days', waterRequirement: '400-600 mm' },
      fertilizer: {
        basal: 'FYM 8 tonnes/acre + DAP 50 kg/acre + MOP 50 kg/acre',
        topDressing: ['Urea 25 kg at 15 days after transplanting', 'NPK 19:19:19 at flowering'],
        organic: 'Vermicompost 2 tonnes/acre',
        schedule: [
          { stage: 'Land Preparation', fertilizer: 'FYM + DAP + MOP', quantity: '8 tonnes + 50 kg + 50 kg/acre' },
          { stage: '15 DAT', fertilizer: 'Urea', quantity: '25 kg/acre' },
          { stage: 'Flowering', fertilizer: 'NPK 19:19:19', quantity: '5 g/L foliar spray' }
        ]
      },
      pests: [
        { name: 'Fruit Borer', symptoms: 'Circular holes in fruits, frass', control: 'Spray Spinosad or Emamectin', pesticide: 'Emamectin 0.5 g/L' },
        { name: 'Whitefly', symptoms: 'Yellowing, virus transmission', control: 'Yellow sticky traps + Imidacloprid', pesticide: 'Imidacloprid 0.3 ml/L' }
      ],
      diseases: [
        { name: 'Early Blight', symptoms: 'Dark brown concentric rings on leaves', control: 'Spray Mancozeb + Cymoxanil', fungicide: 'Mancozeb 2.5 g + Cymoxanil 1 g/L' },
        { name: 'Late Blight', symptoms: 'Water-soaked lesions, white growth underneath', control: 'Spray Metalaxyl + Mancozeb', fungicide: 'Metalaxyl 2.5 g/L' }
      ],
      harvesting: { indicators: 'Fruit turns light red/pink, firm', method: 'Manual harvesting every 3-4 days', yield: '100-200 quintals/acre' },
      marketPrice: { msp: 0, unit: 'Quintal' },
      states: ['Maharashtra', 'AP', 'Karnataka', 'MP', 'UP', 'Bihar'],
      tips: ['Stake plants at 30 cm height for better quality', 'Remove suckers weekly for indeterminate varieties', 'Calcium spray prevents blossom end rot'],
      image: 'tomato'
    },
    {
      name: 'Mustard',
      localNames: { hindi: 'सरसों', punjabi: 'ਸਰੋਂ', marathi: 'मोहरी' },
      category: 'Oilseed',
      season: 'Rabi',
      duration: '110-140 days',
      soilType: ['Sandy Loam', 'Loamy', 'Well-drained'],
      soilPH: { min: 6.0, max: 7.5 },
      climate: { temperature: '10-25°C', rainfall: '25-40 cm', humidity: '50-60%' },
      irrigation: { method: ['Furrow', 'Flood'], frequency: 'At critical stages', waterRequirement: '200-350 mm' },
      fertilizer: {
        basal: 'DAP 50 kg/acre + Sulfur 20 kg/acre',
        topDressing: ['Urea 35 kg/acre at 20 days'],
        organic: 'FYM 3 tonnes/acre',
        schedule: [
          { stage: 'Sowing', fertilizer: 'DAP + S', quantity: '50 kg + 20 kg/acre' },
          { stage: '20-25 days', fertilizer: 'Urea', quantity: '35 kg/acre' }
        ]
      },
      pests: [
        { name: 'Aphids', symptoms: 'Yellowing, curling of leaves', control: 'Spray Oxydemeton-methyl', pesticide: 'Imidacloprid 0.3 ml/L' }
      ],
      diseases: [
        { name: 'White Rust', symptoms: 'White pustules on leaves and stems', control: 'Spray Metalaxyl + Mancozeb', fungicide: 'Metalaxyl + Mancozeb 2.5 g/L' }
      ],
      harvesting: { indicators: 'Pods turn yellowish, seeds become hard', method: 'Manual cutting or combine', yield: '5-8 quintals/acre' },
      marketPrice: { msp: 5650, unit: 'Quintal' },
      states: ['Rajasthan', 'UP', 'Haryana', 'MP', 'Punjab', 'Bihar'],
      tips: ['Sow on time in October for best yield', 'One irrigation at flowering stage is critical', 'Sulfur application improves oil content'],
      image: 'mustard'
    }
  ];

  await Crop.insertMany(crops);
  console.log('Crop seed data inserted');
};

// Seed on startup
seedCrops().catch(console.error);

// @GET /api/crops - Get all crops
router.get('/', async (req, res) => {
  try {
    const { category, season, search, state } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (season) filter.season = season;
    if (state) filter.states = { $in: [state] };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'localNames.hindi': { $regex: search, $options: 'i' } }
      ];
    }

    const crops = await Crop.find(filter).select('name localNames category season duration soilType climate marketPrice states image');
    res.json({ success: true, count: crops.length, crops });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching crops' });
  }
});

// @GET /api/crops/:id - Get single crop
router.get('/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    res.json({ success: true, crop });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching crop' });
  }
});

module.exports = router;
