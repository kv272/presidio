const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const dotenv = require('dotenv');

const User = require('../models/User');
const Seller = require('../models/Seller');

dotenv.config();

const router = express.Router();

// Common Signup Route
router.post(
    '/signup',
    [
        check('firstName', 'First name is required').not().isEmpty(),
        check('lastName', 'Last name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('phoneNumber', 'Phone number is required').not().isEmpty(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
        check('role', 'Role is required and should be either User or Seller').isIn(['User', 'Seller'])
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, email, phoneNumber, password, role } = req.body;

        try {
            let user;
            if (role === 'User') {
                user = await User.findOne({ email });
            } else if (role === 'Seller') {
                user = await Seller.findOne({ email });
            }

            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }
            user = new Seller({
                firstName,
                lastName,
                email,
                phoneNumber,
                password
                }
            )
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                    role: role
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
        check('role', 'Role is required and should be either User or Seller').isIn(['User', 'Seller'])
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, role } = req.body;

        try {
            let user;
            if (role === 'User') {
                user = await User.findOne({ email });
            } else if (role === 'Seller') {
                user = await Seller.findOne({ email });
            }

            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const payload = {
                user: {
                    id: user.id,
                    role: role
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
