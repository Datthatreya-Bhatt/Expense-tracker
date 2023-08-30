const expense = require('../controller/expense');
const express = require('express');
const auth = require('../middleware/auth');


const router = express.Router();

router.get('/expense/data/:page/pagelimit',auth.auth,expense.getExpenseData );
router.get('/expense',expense.getData);
router.post('/expense/data',auth.auth,expense.postData);
router.delete('/expense/:id',auth.auth,expense.deleteData);
router.get('/ispremium',auth.auth,expense.isPremium);

module.exports = router;
