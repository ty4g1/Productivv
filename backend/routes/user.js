const express = require('express');
//controller funxtions
const {signupUser, loginUser, findUser, getUserProfile, updateUserProfile, verifyUser, resendVerification} = require('../controllers/userController');

const router = express.Router();

//login route
router.post('/login', loginUser);

//signup route
router.post('/signup', signupUser);

//find route
router.get('/find/:username', findUser);

//profile route
router.post('/profile', getUserProfile);

//update profile route
router.patch('/update', updateUserProfile);

//verify user route
router.post('/verify', verifyUser);

//resend verification code route
router.post('/resend', resendVerification);

//export
module.exports = router;