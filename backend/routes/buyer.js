const express = require('express');
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const Property = require('../models/Property');
const Interest = require('../models/Interest');
const Seller = require('../models/Seller');

const router = express.Router();

// Get all properties
router.get('/properties', async (req, res) => {
    try {
        const properties = await Property.find().sort({ createdAt: -1 });
        res.json(properties);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Express interest in a property
router.post('/interested/:id', authMiddleware('User'), async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }

        const newInterest = new Interest({
            buyer: req.user.id,
            property: req.params.id
        });

        await newInterest.save();

        const seller = await Seller.findById(property.seller).select('-password');
        res.json(seller);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get properties with filters
router.get('/properties/search', async (req, res) => {
    const { place, area, numberOfBedrooms, numberOfBathrooms, nearbyHospitals, nearbyColleges, minPrice, maxPrice } = req.query;

    const filters = {};
    if (place) filters.place = place;
    if (area) filters.area = { $gte: area };
    if (numberOfBedrooms) filters.numberOfBedrooms = numberOfBedrooms;
    if (numberOfBathrooms) filters.numberOfBathrooms = numberOfBathrooms;
    if (nearbyHospitals) filters.nearbyHospitals = { $regex: nearbyHospitals, $options: 'i' };
    if (nearbyColleges) filters.nearbyColleges = { $regex: nearbyColleges, $options: 'i' };
    if (minPrice) filters.price = { $gte: minPrice };
    if (maxPrice) filters.price = { $lte: maxPrice };

    try {
        const properties = await Property.find(filters).sort({ createdAt: -1 });
        res.json(properties);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
