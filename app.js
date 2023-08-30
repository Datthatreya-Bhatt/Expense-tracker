const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const user = require('./routes/user');
const expense = require('./routes/expense');
const purchase = require('./routes/purchase');
const premium = require('./routes/premium');
const forgotpassword = require('./routes/forgotpassword');

const app = express();
app.use(cors());

app.use(express.static('public'));

app.use(parser.urlencoded({extended:false}));
app.use(parser.json());

const logFile = fs.createWriteStream(path.join(__dirname, 'logFile.log'), {flag: 'a'});

app.use(helmet());
app.use(morgan('combined', {stream: logFile}));

app.use(user);
app.use(expense);
app.use(purchase);
app.use(premium);
app.use(forgotpassword);

app.listen(process.env.PORT || 3000);