const express = require('express');
//controller funxtions
const {signupUser, loginUser, findUser, getUserProfile, updateUserProfile} = require('../controllers/userController');

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

//export
module.exports = router;