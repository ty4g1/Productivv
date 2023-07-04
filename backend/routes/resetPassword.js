const express = require('express');

//controller functions
const {verifyResetToken, resetPassword, sendResetEmail} = require('../controllers/resetPassController');

const router = express.Router();

//verify reset token route
router.get('/:token', verifyResetToken);

//reset password route
router.patch('/pass', resetPassword);

//send reset email route
router.post('/email', sendResetEmail);

//export
module.exports = router;
