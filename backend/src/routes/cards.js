const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// Get user's cards
router.get('/', protect, async (req, res) => {
  try {
    const cards = await Card.find({ userId: req.user.id });
    res.json({ success: true, data: cards });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Request new card
router.post('/request', protect, async (req, res) => {
  try {
    const { cardType } = req.body;
    
    // Check if user already has 3 cards
    const existingCards = await Card.countDocuments({ userId: req.user.id });
    if (existingCards >= 3) {
      return res.status(400).json({ 
        success: false, 
        message: 'Maximum 3 cards allowed per user' 
      });
    }

    const card = await Card.create({
      userId: req.user.id,
      cardNumber: Card.generateCardNumber(),
      cardType: cardType || 'debit',
      expiryDate: Card.generateExpiryDate(),
      cvv: Card.generateCVV(),
      status: 'active'
    });

    res.status(201).json({ 
      success: true, 
      data: card,
      message: 'Card created successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Block/Unblock card
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const card = await Card.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }

    card.status = status;
    await card.save();

    res.json({ 
      success: true, 
      data: card,
      message: `Card ${status === 'blocked' ? 'blocked' : 'activated'} successfully` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update card limits
router.put('/:id/limits', protect, async (req, res) => {
  try {
    const { dailyLimit, monthlyLimit } = req.body;
    const card = await Card.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }

    if (dailyLimit) card.dailyLimit = dailyLimit;
    if (monthlyLimit) card.monthlyLimit = monthlyLimit;
    await card.save();

    res.json({ 
      success: true, 
      data: card,
      message: 'Card limits updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ATM Withdrawal simulation
router.post('/withdraw', protect, async (req, res) => {
  try {
    const { cardId, amount, atmLocation } = req.body;
    
    const card = await Card.findOne({ _id: cardId, userId: req.user.id });
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }

    if (card.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Card is not active' });
    }

    if (amount > card.dailyLimit) {
      return res.status(400).json({ 
        success: false, 
        message: `Daily limit exceeded. Maximum: $${card.dailyLimit}` 
      });
    }

    const user = await User.findById(req.user.id);
    if (user.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    user.balance -= parseFloat(amount);
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'debit',
      amount: parseFloat(amount),
      description: `ATM Withdrawal - ${atmLocation || 'Unknown Location'}`,
      balanceAfter: user.balance
    });

    res.json({
      success: true,
      message: 'ATM withdrawal successful',
      data: {
        amount: parseFloat(amount),
        newBalance: user.balance,
        cardNumber: card.cardNumber.slice(-4)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete card
router.delete('/:id', protect, async (req, res) => {
  try {
    const card = await Card.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }

    await card.deleteOne();
    res.json({ success: true, message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;