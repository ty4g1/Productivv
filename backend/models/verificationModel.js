const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sendEmail = require('../services/sendEmail');
const bcrypt = require('bcrypt');

const verificationSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    expiresAt: {
        type: Date,
        default: Date.now() + 3600000,   //1 hour
    }
});

verificationSchema.statics.sendVerification = async function(email) {
    const code = Math.floor(100000 + Math.random() * 900000);    //generate 6 digit code
    //hash code
    const salt = await bcrypt.genSalt(10);   //append to end of code so idenctical codes have different hashes
    const hash = await bcrypt.hash(String(code), salt);
    //create verification
    const verification = await this.create({email, code: hash});
    //send email
    sendEmail(email, "Verify your email", `<p>Enter this code to verify your email: <b>${code}</b></p><br><p>Code expires in 1 hour</p>`);
}


module.exports = mongoose.model('Verification', verificationSchema);
