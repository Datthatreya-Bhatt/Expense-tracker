const mongoose = require('mongoose');


// User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  total_expense: { type: Number, required: true },
});

const User = mongoose.model('User', userSchema);

// Expense Schema and Model
const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Expense = mongoose.model('Expense', expenseSchema);

// Orders Schema and Model
const orderSchema = new mongoose.Schema({
  paymentid: String,
  orderid: String,
  status: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Orders = mongoose.model('Orders', orderSchema);

// ForgotPasswordRequests Schema and Model
const forgotPasswordRequestSchema = new mongoose.Schema({
  id: {type: String, required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, required: true },
});

const ForgotPasswordRequests = mongoose.model('ForgotPasswordRequests', forgotPasswordRequestSchema);

// DownloadedFile Schema and Model
const downloadedFileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  links: { type: String, required: true },
});

const DownloadedFile = mongoose.model('DownloadedFile', downloadedFileSchema);

// Create the tables in the database
async function createTables() {
  try {
    await Promise.all([
      User.init(),
      Expense.init(),
      Orders.init(),
      ForgotPasswordRequests.init(),
      DownloadedFile.init(),
    ]);

    console.log('Schemas created successfully');
  } catch (err) {
    console.trace(err);
  }
}

createTables();

module.exports = {
  User,
  Expense,
  Orders,
  ForgotPasswordRequests,
  DownloadedFile,
};










