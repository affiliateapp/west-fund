const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  accountNumber: {
    type: String,
    unique: true,
    required: true
  },
  balance: {
    type: Number,
    default: 1000.00,
    min: 0
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },
  
  // NEW FIELDS - Personal Details
  firstName: {
    type: String,
    trim: true
  },
  middleName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  houseAddress: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  
  // Employment Information
  occupation: {
    type: String,
    trim: true
  },
  annualIncome: {
    type: String,
    trim: true
  },
  
  // Banking Details
  accountType: {
    type: String,
    enum: ['Savings', 'Checking', 'Business', ''],
    default: ''
  },
  accountCurrency: {
    type: String,
    default: 'USD'
  },
  twoFactorPin: {
    type: String,
    select: false
  },
  passportPhoto: {
    type: String // Base64 string
  },
  



// Add these fields before createdAt
kycStatus: {
  type: String,
  enum: ['not_submitted', 'pending', 'verified', 'rejected'],
  default: 'not_submitted'
},
kycDocuments: {
  idCardFront: { type: String }, // Base64
  idCardBack: { type: String },  // Base64
  proofOfAddress: { type: String }, // Base64
  selfieWithId: { type: String }  // Base64
},
kycSubmittedAt: {
  type: Date
},
kycVerifiedAt: {
  type: Date
},
kycRejectionReason: {
  type: String
},


  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate account number
userSchema.statics.generateAccountNumber = function() {
  return '30' + Math.floor(10000000 + Math.random() * 90000000).toString();
};

module.exports = mongoose.model('User', userSchema);

