const express = require('express');
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const Property = require('../models/Property');

const router = express.Router();

// Like a property
router.post('/like/:id', authMiddleware('User'), async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }

        property.likes += 1;
        await property.save();

        res.json(property);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
