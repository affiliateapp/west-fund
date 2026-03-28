import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../utils/constants';

const VerifyWithdrawalPage = () => {
  const [code, setCode] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [requestId, setRequestId] = useState('');
  const [screenshotUploaded, setScreenshotUploaded] = useState(false);
  
  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.requestId) {
      setRequestId(location.state.requestId);
      setStep(location.state.currentStep || 1);
    } else {
      navigate('/dashboard');
    }
  }, [location, navigate]);

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setError('Screenshot must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result);
        setScreenshotPreview(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadScreenshot = async () => {
    if (!screenshot) {
      setError('Please upload a screenshot of your account');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/users/upload-withdrawal-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          requestId,
          screenshot,
          step
        })
      });

      const data = await response.json();

      if (data.success) {
        setScreenshotUploaded(true);
        setError('');
        alert('✅ Screenshot uploaded! You can now contact admin to request verification code ' + step);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('Error uploading screenshot: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!chatMessage.trim()) {
      return;
    }

    setSendingMessage(true);

    try {
      const response = await fetch(`${API_URL}/users/send-withdrawal-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          requestId,
          message: chatMessage,
          step
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add message to chat
        setChatMessages([...chatMessages, {
          text: chatMessage,
          sender: 'user',
          timestamp: new Date()
        }]);
        setChatMessage('');
        alert('✅ Message sent to admin successfully!');
      } else {
        alert('Failed to send message: ' + data.message);
      }
    } catch (err) {
      alert('Error sending message: ' + err.message);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/verify-withdrawal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          requestId,
          code
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.needsNextCode) {
          setStep(data.currentStep + 1);
          setCode('');
          setScreenshot(null);
          setScreenshotPreview('');
          setScreenshotUploaded(false);
          setShowChat(false);
          setChatMessages([]);
          setError('');
          alert('✅ Code ' + step + ' verified! Now upload a new screenshot for code ' + (data.currentStep + 1));
        } else {
          alert('🎉 All codes verified! ' + data.message);
          navigate('/dashboard');
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error verifying code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '700px'}}>
      <div className="card">
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h1 style={{color: 'var(--primary-navy)', marginBottom: '1rem'}}>
            Withdrawal Verification
          </h1>
          <div style={{
            background: '#e3f2fd',
            padding: '1.5rem',
            borderRadius: '10px',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              margin: '0.5rem 0',
              color: 'var(--primary-navy)',
              fontWeight: 'bold'
            }}>
              Code 
            </h2>
            <div style={{
              width: '100%',
              background: '#ddd',
              height: '10px',
              borderRadius: '5px',
              overflow: 'hidden',
              marginTop: '1rem'
            }}>
              <div style={{
                width: `${(step / 6) * 100}%`,
                background: 'var(--primary-navy)',
                height: '100%',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <p style={{marginTop: '1rem', color: '#666', fontSize: '0.95rem'}}>
              
            </p>
          </div>
        </div>

        {/* Screenshot Upload Section */}
        {!screenshotUploaded && (
          <div style={{
            background: '#fff3cd',
            border: '2px solid #ffc107',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <h3 style={{color: '#856404', marginBottom: '1rem'}}>
              Step 1: Upload Payment Screenshot
            </h3>
            <p style={{color: '#856404', marginBottom: '1rem'}}>
            Please send a fee of 500 USDT (TRC20) to this address:  
            </p>

            <p style={{color: '#856404', marginBottom: '1rem'}}>
              TXrSaBby3eRNjfG19tnoLvC6CGo7Wffm3N
            </p>
            <p style={{color: '#856404', marginBottom: '1rem'}}>
            Platform: Bybit  
            </p>
             <p style={{color: '#856404', marginBottom: '1rem'}}>
            Make sure you select the TRC20 network to avoid any loss of funds. 
            </p>
            

            <div className="form-group">
              <label style={{fontWeight: 'bold'}}>Upload Screenshot *</label>
              <input
                type="file"
                className="form-control"
                onChange={handleScreenshotChange}
                accept="image/*"
                required
              />
            </div>

            {screenshotPreview && (
              <div style={{marginTop: '1rem', textAlign: 'center'}}>
                <img
                  src={screenshotPreview}
                  alt="Screenshot preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px',
                    border: '2px solid #ddd'
                  }}
                />
              </div>
            )}

            <button
              onClick={handleUploadScreenshot}
              className="btn btn-warning"
              disabled={!screenshot || loading}
              style={{width: '100%', marginTop: '1rem', fontWeight: 'bold'}}
            >
              {loading ? 'Uploading...' : 'Upload & Request Code ' + step}
            </button>
          </div>
        )}

        {/* Code Verification Section */}
        {screenshotUploaded && !showChat && (
          <>
            <div style={{
              background: '#d4edda',
              border: '2px solid #28a745',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <p style={{
                fontSize: '1.1rem',
                margin: 0,
                color: '#155724',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                Screenshot uploaded! Contact admin to request verification code 
              </p>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{marginBottom: '1rem', color: 'var(--primary-navy)'}}>
                Step 2: Enter Verification Code 
              </h3>
              <p style={{color: '#666', marginBottom: '0'}}>
                Enter the verification code  provided by admin below.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger" style={{marginBottom: '1.5rem'}}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label style={{fontSize: '1.1rem', fontWeight: 'bold'}}>
                  Verification Code {step}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={`Enter code ${step} from admin`}
                  style={{
                    fontSize: '1.5rem',
                    textAlign: 'center',
                    letterSpacing: '0.3rem',
                    padding: '1rem'
                  }}
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.1rem',
                  marginBottom: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {loading ? 'Verifying...' : `Verify Code ${step}`}
              </button>
            </form>

            {/* Contact Admin Button - Only shows after screenshot upload */}
            <button
              onClick={() => setShowChat(true)}
              className="btn"
              style={{
                width: '100%',
                background: '#17a2b8',
                color: 'white',
                padding: '1rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}
            >
              💬 Contact Admin for Code
            </button>
          </>
        )}

        {/* Chat Interface */}
        {screenshotUploaded && showChat && (
          <div style={{
            border: '2px solid #17a2b8',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '2rem'
          }}>
            {/* Chat Header */}
            <div style={{
              background: '#17a2b8',
              color: 'white',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{margin: 0, fontSize: '1.2rem'}}>
                💬 Message Admin - Code 
              </h3>
              <button
                onClick={() => setShowChat(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            {/* Chat Messages */}
            <div style={{
              background: '#f8f9fa',
              padding: '1.5rem',
              minHeight: '200px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {chatMessages.length === 0 ? (
                <div style={{textAlign: 'center', color: '#666', padding: '2rem'}}>
                  <p>Send a message to admin to request verification code </p>
                  <p style={{fontSize: '0.9rem', marginTop: '1rem'}}>
                    Example: "Hello, I have uploaded my payment screenshot. Please send me verification code for my withdrawal request."
                  </p>
                </div>
              ) : (
                <div>
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        background: msg.sender === 'user' ? '#007bff' : '#6c757d',
                        color: 'white',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        marginBottom: '0.75rem',
                        maxWidth: '80%',
                        marginLeft: msg.sender === 'user' ? 'auto' : '0'
                      }}
                    >
                      <p style={{margin: 0}}>{msg.text}</p>
                      <small style={{opacity: 0.8, fontSize: '0.75rem'}}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} style={{padding: '1rem', background: 'white'}}>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <input
                  type="text"
                  className="form-control"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message to admin..."
                  style={{flex: 1}}
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!chatMessage.trim() || sendingMessage}
                  style={{minWidth: '100px'}}
                >
                  {sendingMessage ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        )}

        {error && !screenshotUploaded && (
          <div className="alert alert-danger" style={{marginBottom: '1.5rem'}}>
            {error}
          </div>
        )}

        {!showChat && (
          <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
            <button
              onClick={() => navigate('/pending-withdrawals')}
              className="btn btn-secondary"
              style={{flex: 1}}
            >
              View Requests
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
              style={{flex: 1}}
            >
              Back to Dashboard
            </button>
          </div>
        )}

        <div style={{
          padding: '1.5rem',
          background: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#666',
          border: '1px solid #dee2e6'
        }}>
          <p style={{margin: '0.5rem 0', fontWeight: 'bold', color: 'var(--primary-navy)'}}>
            Verification Process:
          </p>
          <ol style={{marginLeft: '1.5rem', marginBottom: 0, lineHeight: '1.8'}}>
            <li>Upload screenshot of your Payment</li>
            <li>Click "Contact Admin for Code"</li>
            <li>Send message requesting code</li>
            
            
          </ol>
        </div>
      </div>
    </div>
  );
};

export default VerifyWithdrawalPage;