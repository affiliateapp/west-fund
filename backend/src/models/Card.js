const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true
  },
  cardType: {
    type: String,
    enum: ['debit', 'credit'],
    default: 'debit'
  },
  expiryDate: {
    type: String,
    required: true
  },
  cvv: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'blocked', 'pending'],
    default: 'active'
  },
  dailyLimit: {
    type: Number,
    default: 5000
  },
  monthlyLimit: {
    type: Number,
    default: 50000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate card number
cardSchema.statics.generateCardNumber = function() {
  return '4532' + Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

// Generate CVV
cardSchema.statics.generateCVV = function() {
  return Math.floor(100 + Math.random() * 900).toString();
};

// Generate expiry date (3 years from now)
cardSchema.statics.generateExpiryDate = function() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 3);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${year}`;
};

module.exports = mongoose.model('Card', cardSchema);