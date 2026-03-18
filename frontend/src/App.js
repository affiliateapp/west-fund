import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SavingsPage from './pages/SavingsPage';
import CurrentAccountPage from './pages/CurrentAccountPage';
import LoansPage from './pages/LoansPage';
import CardsPage from './pages/CardsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import TransferPage from './pages/TransferPage';
import DepositPage from './pages/DepositPage';
import ProfilePage from './pages/ProfilePage';
import MyCardsPage from './pages/MyCardsPage';
import WithdrawPage from './pages/WithdrawPage';
import ATMWithdrawPage from './pages/ATMWithdrawPage';
import RequestCardPage from './pages/RequestCardPage';
import PendingWithdrawalsPage from './pages/PendingWithdrawalsPage';
import KYCVerificationPage from './pages/KYCVerificationPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminKYCReviewPage from './pages/AdminKYCReviewPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/savings" element={<SavingsPage />} />
            <Route path="/current" element={<CurrentAccountPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* User Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/transfer" element={<ProtectedRoute><TransferPage /></ProtectedRoute>} />
            <Route path="/deposit" element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/my-cards" element={<ProtectedRoute><MyCardsPage /></ProtectedRoute>} />
            <Route path="/withdraw" element={<ProtectedRoute><WithdrawPage /></ProtectedRoute>} />
            <Route path="/atm-withdraw" element={<ProtectedRoute><ATMWithdrawPage /></ProtectedRoute>} />
            <Route path="/request-card" element={<ProtectedRoute><RequestCardPage /></ProtectedRoute>} />
            <Route path="/pending-withdrawals" element={<ProtectedRoute><PendingWithdrawalsPage /></ProtectedRoute>} />
            <Route path="/kyc-verification" element={<ProtectedRoute><KYCVerificationPage /></ProtectedRoute>} />
            
            {/* Admin Protected Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/kyc" element={<ProtectedRoute adminOnly><AdminKYCReviewPage /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;