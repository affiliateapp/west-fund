import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';

const ATMWithdrawPage = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState('');
  const [amount, setAmount] = useState('');
  const [atmLocation, setAtmLocation] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch(`${API_URL}/cards`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCards(data.data.filter(card => card.status === 'active'));
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/cards/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ cardId: selectedCard, amount: parseFloat(amount), atmLocation })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Withdrawal successful! New balance: ${formatCurrency(data.data.newBalance)}`);
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error processing withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '600px'}}>
      <div className="card">
        <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>ATM Withdrawal</h1>
        
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {cards.length === 0 ? (
          <div>
            <p>You don't have any active cards.</p>
            <Link to="/request-card" className="btn btn-primary">Request a Card</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Card</label>
              <select className="form-control" value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)} required>
                <option value="">Choose a card...</option>
                {cards.map((card) => (
                  <option key={card._id} value={card._id}>
                    **** **** **** {card.cardNumber.slice(-4)} - Daily Limit: {formatCurrency(card.dailyLimit)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" min="1" required />
            </div>

            <div className="form-group">
              <label>ATM Location (Optional)</label>
              <input type="text" className="form-control" value={atmLocation} onChange={(e) => setAtmLocation(e.target.value)} placeholder="e.g., Main Street Branch" />
            </div>

            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Processing...' : 'Withdraw Cash'}
              </button>
              <Link to="/my-cards" className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ATMWithdrawPage;
