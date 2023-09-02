const expense = require('../controller/expense');
const auth = require('../middleware/auth');

const express = require('express');


const router = express.Router();

router.get('/expense',expense.getData);
router.get('/expense/data/:page/pagelimit',auth.auth,expense.getExpenseData );

router.post('/expense/data',auth.auth,expense.postData);
router.delete('/expense/:id',auth.auth,expense.deleteData);


module.exports = router;
