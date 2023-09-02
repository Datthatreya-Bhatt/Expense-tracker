const express = require('express');

const forgotpassword = require('../controller/forgotpassword');

const router = express.Router();

router.post('/password/forgotpassword',forgotpassword.getEmail);
router.get('/forgotpassword',forgotpassword.getforgotpasswordPage);
router.get('/password/resetpassword/:id',forgotpassword.getResetPage);
router.post('/password/resetpassword/:id',forgotpassword.postResetPas);


module.exports = router;
