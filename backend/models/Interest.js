const mongoose = require('mongoose');

const InterestSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Interest = mongoose.model('Interest', InterestSchema);

module.exports = Interest;
