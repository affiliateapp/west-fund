const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Submit KYC Documents
router.post('/submit-kyc', protect, async (req, res) => {
  try {
    const { documents } = req.body;

    const user = await User.findById(req.user.id);

    if (user.kycStatus === 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Your account is already verified'
      });
    }

    user.kycDocuments = documents;
    user.kycStatus = 'pending';
    user.kycSubmittedAt = new Date();

    await user.save();

    res.json({
      success: true,
      message: 'KYC documents submitted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;