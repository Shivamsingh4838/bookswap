import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(baseUrl + '/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center p-6">Loading books...</div>;
  }

  return (
    <div className="container">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to BookSwap Marketplace</h1>
        <p className="text-lg mb-6">Discover and exchange used books with fellow readers</p>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search books by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ maxWidth: '500px', margin: '0 auto' }}
          />
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center p-6">
          <h2 className="text-xl mb-4">No books found</h2>
          <p>Try adjusting your search terms or check back later for new books.</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {filteredBooks.map(book => (
            <div key={book._id} className="card">
              {book.image && (
                <img 
                  src={`http://localhost:5000/uploads/${book.image}`} 
                  alt={book.title}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}
                />
              )}
              <h3 className="text-xl font-bold mb-2">{book.title}</h3>
              <p className="text-sm mb-2">by {book.author}</p>
              <p className="text-sm mb-2">Condition: <span style={{ 
                color: book.condition === 'Excellent' ? '#10b981' : 
                       book.condition === 'Good' ? '#3b82f6' : 
                       book.condition === 'Fair' ? '#f59e0b' : '#ef4444'
              }}>{book.condition}</span></p>
              <p className="text-sm mb-4">Owner: {book.owner.name}</p>
              {book.description && (
                <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
                  {book.description.length > 100 
                    ? `${book.description.substring(0, 100)}...` 
                    : book.description
                  }
                </p>
              )}
              <Link to={`/book/${book._id}`} className="btn btn-primary" style={{ width: '100%' }}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
