//json web token 
const jwt = require('jsonwebtoken');
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'});
};

//login user
const User = require('../models/userModel');
const loginUser = async (req, res) => {
    //res.json({message: "Login user"});
    const {email, password} = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({username: user.username, email, token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

//signup user
const signupUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.signup(email, password);
        const token = createToken(user._id);
        res.status(200).json({username: user.username, email, token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

//find user (for bot)
const findUser = async (req, res) => {
    const username = req.params.username;
    console.log(username);
    try {
        const user = await User.find(username);
        const token = createToken(user._id);
        res.status(200).json({username, token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

//get user profile
const getUserProfile = async (req, res) => {
    const {email} = req.body;
    console.log(email);
    try {
        const user = await User.profile(email);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

//update user profile
const updateUserProfile = async (req, res) => {
    const body = req.body;
    try {
        const user = await User.updateProfile(body);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}
 
module.exports = {
    signupUser,
    loginUser,
    findUser,
    getUserProfile,
    updateUserProfile
};