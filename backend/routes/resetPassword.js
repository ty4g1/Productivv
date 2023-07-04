const express = require('express');

//controller functions
const {verifyResetToken, resetPassword} = require('../controllers/resetPassController');

const router = express.Router();

//verify reset token route
router.get('/:token', verifyResetToken);

//reset password route
router.patch('/pass', resetPassword);

//export
module.exports = router;
