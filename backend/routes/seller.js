const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Seller = require('../models/Seller');

const router = express.Router();

// Protected route for getting seller profile
router.get('/me', authMiddleware('Seller'), async (req, res) => {
    try {
        const seller = await Seller.findById(req.user.id).select('-password');
        res.json(seller);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
