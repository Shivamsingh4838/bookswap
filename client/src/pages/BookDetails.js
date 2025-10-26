import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestMessage, setRequestMessage] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
      setError('Error loading book details');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setError('');
    setSuccess('');
    setRequesting(true);

    try {
      await axios.post(baseUrl + '/api/requests', {
        bookId: id,
        message: requestMessage
      });

      setSuccess('Book request sent successfully!');
      setRequestMessage('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error sending request');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading book details...</div>;
  }

  if (!book) {
    return <div className="text-center p-6">Book not found</div>;
  }

  const isOwner = user && user.id === book.owner._id;

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div className="card">
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {book.image && (
            <img 
              src={`http://localhost:5000/uploads/${book.image}`} 
              alt={book.title}
              style={{ 
                width: '300px', 
                height: '400px', 
                objectFit: 'cover',
                borderRadius: '8px',
                flexShrink: 0
              }}
            />
          )}
          
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
            <p className="text-lg mb-4" style={{ color: '#6b7280' }}>by {book.author}</p>
            
            <div style={{ marginBottom: '20px' }}>
              <p className="text-sm mb-2">
                <strong>Condition:</strong> <span style={{ 
                  color: book.condition === 'Excellent' ? '#10b981' : 
                         book.condition === 'Good' ? '#3b82f6' : 
                         book.condition === 'Fair' ? '#f59e0b' : '#ef4444'
                }}>{book.condition}</span>
              </p>
              
              {book.category && (
                <p className="text-sm mb-2">
                  <strong>Category:</strong> {book.category}
                </p>
              )}
              
              <p className="text-sm mb-2">
                <strong>Owner:</strong> {book.owner.name}
              </p>
              
              <p className="text-sm mb-2" style={{ color: book.isAvailable ? '#10b981' : '#ef4444' }}>
                <strong>Status:</strong> {book.isAvailable ? 'Available' : 'Not Available'}
              </p>
            </div>
            
            {book.description && (
              <div style={{ marginBottom: '20px' }}>
                <h3 className="text-lg font-bold mb-2">Description</h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  {book.description}
                </p>
              </div>
            )}
            
            {!isOwner && book.isAvailable && (
              <div style={{ marginTop: '24px' }}>
                <h3 className="text-lg font-bold mb-4">Request This Book</h3>
                
                {error && (
                  <div className="alert alert-error">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success">
                    {success}
                  </div>
                )}

                <form onSubmit={handleRequest}>
                  <div className="form-group">
                    <label className="form-label">Message to Owner (Optional)</label>
                    <textarea
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      className="form-textarea"
                      placeholder="Add a personal message to the book owner..."
                      rows="3"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={requesting}
                  >
                    {requesting ? 'Sending Request...' : 'Request This Book'}
                  </button>
                </form>
              </div>
            )}
            
            {isOwner && (
              <div style={{ marginTop: '24px' }}>
                <p className="text-sm" style={{ color: '#6b7280' }}>
                  This is your book. You can manage it from your dashboard.
                </p>
                <button 
                  onClick={() => navigate('/my-books')}
                  className="btn btn-outline"
                  style={{ marginTop: '12px' }}
                >
                  Manage My Books
                </button>
              </div>
            )}
            
            {!book.isAvailable && !isOwner && (
              <div style={{ marginTop: '24px' }}>
                <p className="text-sm" style={{ color: '#ef4444' }}>
                  This book is no longer available for requests.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
