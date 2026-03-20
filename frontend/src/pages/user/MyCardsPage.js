import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';

const MyCardsPage = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setCards(data.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockCard = async (cardId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await fetch(`${API_URL}/cards/${cardId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchCards();
    } catch (error) {
      alert('Error updating card status');
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await fetch(`${API_URL}/cards/${cardId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchCards();
      } catch (error) {
        alert('Error deleting card');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container fade-in" style={{padding: '4rem 0'}}>
      <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>My Cards</h1>
      
      <div style={{marginBottom: '2rem'}}>
        <button onClick={() => navigate('/request-card')} className="btn btn-primary">Request New Card</button>
        <button onClick={() => navigate('/atm-withdraw')} className="btn btn-success" style={{marginLeft: '1rem'}}>ATM Withdrawal</button>
      </div>

      {cards.length === 0 ? (
        <div className="card">
          <p>You don't have any cards yet.</p>
          <button onClick={() => navigate('/request-card')} className="btn btn-primary">Request Your First Card</button>
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
          {cards.map((card) => (
            <div key={card._id} className="card" style={{background: card.status === 'active' ? 'linear-gradient(135deg, var(--secondary-blue), var(--primary-navy))' : 'linear-gradient(135deg, #666, #333)', color: 'white', padding: '2rem'}}>
              <div style={{marginBottom: '2rem'}}>
                <p style={{opacity: 0.8, fontSize: '0.9rem'}}>{card.cardType === 'debit' ? 'DEBIT CARD' : 'CREDIT CARD'}</p>
                <h2 style={{fontSize: '1.5rem', letterSpacing: '2px', marginTop: '1rem'}}>{card.cardNumber.replace(/(\d{4})/g, '$1 ')}</h2>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
                <div>
                  <p style={{opacity: 0.7, fontSize: '0.8rem'}}>VALID THRU</p>
                  <p style={{fontSize: '1.1rem'}}>{card.expiryDate}</p>
                </div>
                <div>
                  <p style={{opacity: 0.7, fontSize: '0.8rem'}}>CVV</p>
                  <p style={{fontSize: '1.1rem'}}>***</p>
                </div>
              </div>

              <div style={{marginBottom: '1.5rem'}}>
                <p style={{opacity: 0.7, fontSize: '0.8rem'}}>LIMITS</p>
                <p>Daily: {formatCurrency(card.dailyLimit)}</p>
                <p>Monthly: {formatCurrency(card.monthlyLimit)}</p>
              </div>

              <div style={{marginBottom: '1rem'}}>
                <span style={{padding: '0.25rem 0.75rem', borderRadius: '15px', background: card.status === 'active' ? 'var(--success)' : 'var(--danger)', fontSize: '0.85rem'}}>
                  {card.status.toUpperCase()}
                </span>
              </div>

              <div style={{display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap'}}>
                <button onClick={() => handleBlockCard(card._id, card.status)} className="btn" style={{fontSize: '0.85rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', color: 'white'}}>
                  {card.status === 'active' ? 'Block Card' : 'Unblock Card'}
                </button>
                <button onClick={() => handleDeleteCard(card._id)} className="btn btn-danger" style={{fontSize: '0.85rem', padding: '0.5rem 1rem'}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{marginTop: '2rem'}}>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">Back to Dashboard</button>
      </div>
    </div>
  );
};

export default MyCardsPage;