const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth'); 

// Get all KYC requests
router.get('/kyc-requests', protect, admin, async (req, res) => { 
  try {
    const users = await User.find({
      kycStatus: { $in: ['pending', 'verified', 'rejected'] }
    }).sort({ kycSubmittedAt: -1 });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Approve KYC
router.put('/kyc/:userId/approve', protect, admin, async (req, res) => { // ← admin not adminOnly
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.kycStatus = 'verified';
    user.kycVerifiedAt = new Date();
    user.kycRejectionReason = undefined;

    await user.save();

    res.json({
      success: true,
      message: 'KYC approved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Reject KYC
router.put('/kyc/:userId/reject', protect, admin, async (req, res) => { // ← admin not adminOnly
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.kycStatus = 'rejected';
    user.kycRejectionReason = reason || 'Documents not clear or invalid';

    await user.save();

    res.json({
      success: true,
      message: 'KYC rejected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;