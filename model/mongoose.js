const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/expense', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', () => console.trace('connection error'));
db.once('open', () => {
  console.log('Connected to MongoDB database');
});


module.exports = db;

