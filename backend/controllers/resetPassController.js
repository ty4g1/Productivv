const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
//verify password reset token
const verifyResetToken = async (req, res) => {
    const token = req.params.token;
    try {
        const {_id} = jwt.verify(token, process.env.SECRET);
        const user = await User.findOne({_id});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

//reset password
const resetPassword = async (req, res) => {
    const {password, _id} = req.body;
    try {
        if (!validator.isStrongPassword(password)) {
            throw new Error('Password must be at least 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol');
        }
        //hashing password
        const salt = await bcrypt.genSalt(10);   //append to end of password so idenctical passwords have different hashes
        const hash = await bcrypt.hash(password, salt);

        const user = await User.findByIdAndUpdate({_id}, {password: hash});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}



module.exports = {verifyResetToken, resetPassword};