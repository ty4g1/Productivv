const express = require('express');
//controller funxtions
const {signupUser, loginUser, findUser} = require('../controllers/userController');

const router = express.Router();

//login route
router.post('/login', loginUser);

//signup route
router.post('/signup', signupUser);

//find route
router.get('/find/:username', findUser);

//export
module.exports = router;