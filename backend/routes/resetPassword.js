const express = require('express');

//controller functions
const {verifyResetToken} = require('../controllers/resetPassController');

const router = express.Router();

//verify reset token route
router.get('/:token', verifyResetToken);

//export
module.exports = router;
