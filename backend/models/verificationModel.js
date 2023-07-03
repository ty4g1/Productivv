const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verificationSchema = new Schema({
    userID: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: Date.now + 3600000 //expires in 1 hour
    }
});

module.exports = mongoose.model('Verification', verificationSchema);
