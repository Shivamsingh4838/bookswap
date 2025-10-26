import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    myBooks: 0,
    sentRequests: 0,
    receivedRequests: 0
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [booksResponse, sentRequestsResponse, receivedRequestsResponse] = await Promise.all([
        axios.get(baseUrl + '/api/books/my-books'),
        axios.get(baseUrl + '/api/requests/sent'),
        axios.get(baseUrl + '/api/requests/received')
      ]);

      setStats({
        myBooks: booksResponse.data.length,
        sentRequests: sentRequestsResponse.data.length,
        receivedRequests: receivedRequestsResponse.data.length
      });

      setRecentBooks(booksResponse.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-3 mb-6">
        <div className="card text-center">
          <h3 className="text-2xl font-bold mb-2" style={{ color: '#3b82f6' }}>
            {stats.myBooks}
          </h3>
          <p className="text-lg">My Books</p>
        </div>
        
        <div className="card text-center">
          <h3 className="text-2xl font-bold mb-2" style={{ color: '#10b981' }}>
            {stats.sentRequests}
          </h3>
          <p className="text-lg">Sent Requests</p>
        </div>
        
        <div className="card text-center">
          <h3 className="text-2xl font-bold mb-2" style={{ color: '#f59e0b' }}>
            {stats.receivedRequests}
          </h3>
          <p className="text-lg">Received Requests</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="text-xl font-bold">My Recent Books</h2>
            <Link to="/my-books" className="btn btn-outline">View All</Link>
          </div>
          
          {recentBooks.length === 0 ? (
            <p className="text-center" style={{ color: '#6b7280' }}>
              No books posted yet. <Link to="/add-book" style={{ color: '#3b82f6' }}>Add your first book!</Link>
            </p>
          ) : (
            <div>
              {recentBooks.map(book => (
                <div key={book._id} style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <h3 className="font-bold">{book.title}</h3>
                  <p className="text-sm" style={{ color: '#6b7280' }}>by {book.author}</p>
                  <p className="text-sm">Condition: {book.condition}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/add-book" className="btn btn-primary">
              Add New Book
            </Link>
            
            <Link to="/my-books" className="btn btn-outline">
              Manage My Books
            </Link>
            
            <Link to="/requests" className="btn btn-outline">
              View Requests
            </Link>
            
            <Link to="/" className="btn btn-outline">
              Browse All Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
