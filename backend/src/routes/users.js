const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private

// @route   POST /api/users/withdraw-request
// @desc    Submit withdrawal request
// @access  Private
router.post('/withdraw-request', protect, async (req, res) => {
  try {
    const { amount, transferType, cardNumber, cardHolder, expiryDate, bankName, cardCVC, cardPin } = req.body;
    const WithdrawalRequest = require('../models/WithdrawalRequest');

    const user = await User.findById(req.user.id);
    const fee = transferType === 'card' ? 100 : 5;
    const totalAmount = parseFloat(amount) + fee;

    // Check if sufficient balance
    if (user.balance < totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Deduct fee from balance
    user.balance -= fee;
    await user.save();

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
    await Transaction.create({
      userId: user._id,
      type: 'debit',
      amount: fee,
      description: `Withdrawal fee (${transferType === 'card' ? 'Card' : 'Bank'} transfer)`,
      balanceAfter: user.balance
    });

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

    // FIRST CODE VERIFICATION
    if (request.status === 'approved') {
      if (!request.verificationCode) {
        return res.status(400).json({
          success: false,
          message: 'Verification code not generated yet. Please contact admin.'
        });
      }

      if (request.verificationCode !== code) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification code'
        });
      }

      // First code correct - move to awaiting second code
      request.status = 'awaiting_second_code';
      await request.save();

      return res.json({
        success: true,
        message: 'First code verified! Please wait for admin to generate second code.',
        needsSecondCode: true
      });
    }

    // SECOND CODE VERIFICATION
    if (request.status === 'awaiting_second_code') {
      if (!request.secondVerificationCode) {
        return res.status(400).json({
          success: false,
          message: 'Second verification code not generated yet. Please contact admin.'
        });
      }

      if (request.secondVerificationCode !== code) {
        return res.status(400).json({
          success: false,
          message: 'Invalid second verification code'
        });
      }

      // Second code correct - complete withdrawal
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
        message: 'Withdrawal completed successfully!',
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


module.exports = router;
