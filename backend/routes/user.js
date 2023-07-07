const express = require('express');

//controller funxtions
const {signupUser, 
    loginUser, 
    findUser, 
    getUserProfile, 
    updateUserProfile, 
    deleteUserProfile, 
    verifyUser, 
    resendVerification,
    sendResetPasswordEmail,
    googleLoginUser,
    googleSignupUser,
    updateUserPoints} = require('../controllers/userController');

const router = express.Router();

//login route
router.post('/login', loginUser);

//signup route
router.post('/signup', signupUser);

//verify user route
router.post('/verify', verifyUser);

//resend verification code route
router.post('/resend', resendVerification);


//find route
router.get('/find/:username', findUser);

//profile route
router.post('/profile', getUserProfile);

//update profile route
router.patch('/update', updateUserProfile);

//update points route
router.patch('/updatepoints', updateUserPoints);

//delete profile route
router.delete('/delete/:id', deleteUserProfile);

//send reset password email route
router.post('/reset', sendResetPasswordEmail);

//google login route
router.post('/googlelogin', googleLoginUser);

//google signup route
router.post('/googlesignup', googleSignupUser);

//export
module.exports = router;