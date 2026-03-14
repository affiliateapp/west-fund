const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { generateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// @route   POST /api/auth/register

router.post('/register', [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { 
      fullName, 
      email, 
      password,
      // NEW FIELDS
      firstName,
      middleName,
      lastName,
      country,
      state,
      city,
      zipCode,
      dateOfBirth,
      houseAddress,
      phoneNumber,
      occupation,
      annualIncome,
      accountType,
      accountCurrency,
      twoFactorPin,
      passportPhoto
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Generate account number
    const accountNumber = User.generateAccountNumber();

    // Create user with ALL fields
    const user = await User.create({
      fullName,
      email,
      password,
      accountNumber,
      balance: 1000.00, // Initial demo balance
      // ADD ALL NEW FIELDS
      firstName,
      middleName,
      lastName,
      country,
      state,
      city,
      zipCode,
      dateOfBirth,
      houseAddress,
      phoneNumber,
      occupation,
      annualIncome,
      accountType,
      accountCurrency,
      twoFactorPin,
      passportPhoto
    });

    // Create initial transaction
    await Transaction.create({
      userId: user._id,
      type: 'credit',
      amount: 1000.00,
      description: 'Initial account opening bonus',
      balanceAfter: 1000.00
    });

    res.status(201).json({
  success: true,
  data: {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    accountNumber: user.accountNumber,
    balance: user.balance,
    role: user.role,
    kycStatus: user.kycStatus,
    passportPhoto: user.passportPhoto,  
    token: generateToken(user._id)
  }
});
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is suspended
    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
  success: true,
  data: {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    accountNumber: user.accountNumber,
    balance: user.balance,
    role: user.role,
    kycStatus: user.kycStatus,  
    kycRejectionReason: user.kycRejectionReason,
    passportPhoto: user.passportPhoto,  
    token: generateToken(user._id)
  }
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;