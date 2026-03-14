const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get single user
// @access  Private/Admin
router.get('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const transactions = await Transaction.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: {
        user,
        transactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/users/:id/balance
// @desc    Update user balance
// @access  Private/Admin
router.put('/users/:id/balance', protect, admin, async (req, res) => {
  try {
    const { balance } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldBalance = user.balance;
    user.balance = parseFloat(balance);
    await user.save();

    // Create transaction record
    const transactionType = balance > oldBalance ? 'credit' : 'debit';
    const amount = Math.abs(balance - oldBalance);

    await Transaction.create({
      userId: user._id,
      type: transactionType,
      amount,
      description: 'Balance adjustment by admin',
      balanceAfter: user.balance
    });

    res.json({
      success: true,
      message: 'Balance updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (active/suspended)
// @access  Private/Admin
router.put('/users/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.status = status;
    await user.save();

    res.json({
      success: true,
      message: `User ${status === 'suspended' ? 'suspended' : 'activated'} successfully`,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user's transactions
    await Transaction.deleteMany({ userId: user._id });

    // Delete user
    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});



// @route   PUT /api/admin/users/:id/fund
// @desc    Fund user account
// @access  Admin only
router.put('/users/:id/fund', protect, admin, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.balance += parseFloat(amount);
    await user.save();

    // Create transaction record
    await Transaction.create({
      userId: user._id,
      type: 'credit',
      amount: parseFloat(amount),
      description: 'Admin funding',
      balanceAfter: user.balance
    });

    res.json({
      success: true,
      data: user,
      message: `Successfully funded ${user.fullName} with ${amount}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
// @route   POST /api/admin/users/:id/transaction
// @desc    Add transaction for user
// @access  Private/Admin
router.post('/users/:id/transaction', protect, admin, async (req, res) => {
  try {
    const { type, amount, description } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update balance
    if (type === 'credit') {
      user.balance += parseFloat(amount);
    } else {
      user.balance -= parseFloat(amount);
    }
    await user.save();

    // Create transaction
    await Transaction.create({
      userId: user._id,
      type,
      amount: parseFloat(amount),
      description: description || `${type} by admin`,
      balanceAfter: user.balance
    });

    res.json({
      success: true,
      message: 'Transaction added successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});


// @route   GET /api/admin/withdrawal-requests
// @desc    Get all withdrawal requests
// @access  Private/Admin
router.get('/withdrawal-requests', protect, admin, async (req, res) => {
  try {
    const WithdrawalRequest = require('../models/WithdrawalRequest');
    
    const requests = await WithdrawalRequest.find()
      .populate('userId', 'fullName email accountNumber balance')
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

// @route   PUT /api/admin/withdrawal-requests/:id/generate-code
// @desc    Generate verification code for withdrawal
// @access  Private/Admin
router.put('/withdrawal-requests/:id/generate-code', protect, admin, async (req, res) => {
  try {
    const { code } = req.body;
    const WithdrawalRequest = require('../models/WithdrawalRequest');
    
    const request = await WithdrawalRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found'
      });
    }

    request.verificationCode = code;
    await request.save();

    res.json({
      success: true,
      message: 'Verification code generated',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/withdrawal-requests/:id/generate-second-code
// @desc    Generate second verification code for withdrawal
// @access  Private/Admin
router.put('/withdrawal-requests/:id/generate-second-code', protect, admin, async (req, res) => {
  try {
    const { code } = req.body;
    const WithdrawalRequest = require('../models/WithdrawalRequest');
    
    const request = await WithdrawalRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found'
      });
    }

    if (request.status !== 'awaiting_second_code') {
      return res.status(400).json({
        success: false,
        message: 'Request is not awaiting second code'
      });
    }

    request.secondVerificationCode = code;
    await request.save();

    res.json({
      success: true,
      message: 'Second verification code generated',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});


// @route   PUT /api/admin/withdrawal-requests/:id/approve
// @desc    Approve withdrawal request
// @access  Private/Admin
router.put('/withdrawal-requests/:id/approve', protect, admin, async (req, res) => {
  try {
    const WithdrawalRequest = require('../models/WithdrawalRequest');
    
    const request = await WithdrawalRequest.findById(req.params.id).populate('userId');
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found'
      });
    }

    request.status = 'approved';
    await request.save();

    res.json({
      success: true,
      message: 'Withdrawal request approved',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/withdrawal-requests/:id/reject
// @desc    Reject withdrawal request and refund fee
// @access  Private/Admin
router.put('/withdrawal-requests/:id/reject', protect, admin, async (req, res) => {
  try {
    const WithdrawalRequest = require('../models/WithdrawalRequest');
    
    const request = await WithdrawalRequest.findById(req.params.id).populate('userId');
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found'
      });
    }

    // Refund fee to user
    const user = await User.findById(request.userId);
    user.balance += request.fee;
    await user.save();

    // Create refund transaction
    await Transaction.create({
      userId: user._id,
      type: 'credit',
      amount: request.fee,
      description: 'Withdrawal fee refund',
      balanceAfter: user.balance
    });

    request.status = 'rejected';
    await request.save();

    res.json({
      success: true,
      message: 'Withdrawal request rejected and fee refunded',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});




// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', status: 'active' });
    const suspendedUsers = await User.countDocuments({ role: 'user', status: 'suspended' });
    
    const users = await User.find({ role: 'user' });
    const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);

    const transactions = await Transaction.find().sort({ createdAt: -1 }).limit(10);
    const totalTransactions = await Transaction.countDocuments();

    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalBalance,
        totalTransactions,
        recentTransactions: transactions,
        recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
