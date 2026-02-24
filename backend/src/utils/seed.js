const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      fullName: 'Admin User',
      email: 'admin@westfund.com',
      password: 'admin123',
      accountNumber: User.generateAccountNumber(),
      balance: 0,
      role: 'admin'
    });

    console.log('Admin user created:');
    console.log('Email: admin@westfund.com');
    console.log('Password: admin123');

    // Create demo users
    const demoUser1 = await User.create({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      accountNumber: User.generateAccountNumber(),
      balance: 5000.00
    });

    const demoUser2 = await User.create({
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      accountNumber: User.generateAccountNumber(),
      balance: 7500.00
    });

    console.log('\nDemo users created:');
    console.log('User 1 - Email: john@example.com | Password: password123');
    console.log('User 2 - Email: jane@example.com | Password: password123');

    // Create sample transactions for demo users
    await Transaction.create([
      {
        userId: demoUser1._id,
        type: 'credit',
        amount: 5000,
        description: 'Initial deposit',
        balanceAfter: 5000
      },
      {
        userId: demoUser1._id,
        type: 'debit',
        amount: 150,
        description: 'ATM withdrawal',
        balanceAfter: 4850
      },
      {
        userId: demoUser1._id,
        type: 'credit',
        amount: 150,
        description: 'Deposit correction',
        balanceAfter: 5000
      },
      {
        userId: demoUser2._id,
        type: 'credit',
        amount: 7500,
        description: 'Initial deposit',
        balanceAfter: 7500
      }
    ]);

    console.log('\nSample transactions created');
    console.log('\nSeeding completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
