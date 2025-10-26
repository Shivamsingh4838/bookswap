import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(baseUrl + '/api/books/my-books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await axios.delete(baseUrl + `/api/books/${bookId}`);
      setBooks(books.filter(book => book._id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Error deleting book');
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading your books...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-3xl font-bold">My Books</h1>
        <Link to="/add-book" className="btn btn-primary">
          Add New Book
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="card text-center">
          <h2 className="text-xl mb-4">No books posted yet</h2>
          <p className="mb-4" style={{ color: '#6b7280' }}>
            Start building your book collection by adding your first book!
          </p>
          <Link to="/add-book" className="btn btn-primary">
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="grid grid-2">
          {books.map(book => (
            <div key={book._id} className="card">
              <div style={{ display: 'flex', gap: '16px' }}>
                {book.image && (
                  <img 
                    src={`${process.env.REACT_APP_API_URL}/uploads/${book.image}`} 
                    alt={book.title}
                    style={{ 
                      width: '120px', 
                      height: '160px', 
                      objectFit: 'cover',
                      borderRadius: '8px',
                      flexShrink: 0
                    }}
                  />
                )}
                
                <div style={{ flex: 1 }}>
                  <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                  <p className="text-sm mb-2" style={{ color: '#6b7280' }}>by {book.author}</p>
                  <p className="text-sm mb-2">
                    Condition: <span style={{ 
                      color: book.condition === 'Excellent' ? '#10b981' : 
                             book.condition === 'Good' ? '#3b82f6' : 
                             book.condition === 'Fair' ? '#f59e0b' : '#ef4444'
                    }}>{book.condition}</span>
                  </p>
                  
                  {book.category && (
                    <p className="text-sm mb-2" style={{ color: '#6b7280' }}>
                      Category: {book.category}
                    </p>
                  )}
                  
                  <p className="text-sm mb-2" style={{ color: book.isAvailable ? '#10b981' : '#ef4444' }}>
                    Status: {book.isAvailable ? 'Available' : 'Not Available'}
                  </p>
                  
                  {book.description && (
                    <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
                      {book.description.length > 100 
                        ? `${book.description.substring(0, 100)}...` 
                        : book.description
                      }
                    </p>
                  )}
                  
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Link to={`/edit-book/${book._id}`} className="btn btn-outline" style={{ fontSize: '14px', padding: '8px 16px' }}>
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(book._id)}
                      className="btn btn-danger"
                      style={{ fontSize: '14px', padding: '8px 16px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;
