const express = require('express');

const auth = require('../middleware/auth');
const purchase = require('../controller/purchase');

const router = express.Router();

router.get('/purchasepremium',auth.auth,purchase.getPurchase);

//use premium auth
router.post('/success/purchase',auth.auth,purchase.postSuccess);
router.post('/failed/purchase',auth.auth,purchase.postFailed);

module.exports = router;