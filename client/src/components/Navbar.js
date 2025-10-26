import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ 
      backgroundColor: '#1f2937', 
      color: 'white', 
      padding: '1rem 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            📚 BookSwap
          </Link>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>
                  Dashboard
                </Link>
                <Link to="/my-books" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>
                  My Books
                </Link>
                <Link to="/requests" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>
                  Requests
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
