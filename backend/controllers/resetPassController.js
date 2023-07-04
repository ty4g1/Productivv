const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
//veriy password reset token
const verifyResetToken = async (req, res) => {
    const token = req.params.token;
    try {
        const {_id} = jwt.verify(token, process.env.SECRET);
        user = await User.findOne({_id});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {verifyResetToken};