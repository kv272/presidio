const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true }
});

const Seller = mongoose.model('Seller', SellerSchema);

module.exports = Seller;
