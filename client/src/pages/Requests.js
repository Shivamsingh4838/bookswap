import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Requests = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('sent');
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const [sentResponse, receivedResponse] = await Promise.all([
        axios.get(baseUrl + '/api/requests/sent'),
        axios.get(baseUrl + '/api/requests/received')
      ]);
      
      setSentRequests(sentResponse.data);
      setReceivedRequests(receivedResponse.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId, status, responseMessage = '') => {
    try {
      await axios.put(baseUrl + `/api/requests/${requestId}/respond`, {
        status,
        responseMessage
      });
      
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error responding to request:', error);
      alert('Error responding to request');
    }
  };

  const handleCancel = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) {
      return;
    }

    try {
      await axios.delete(baseUrl + `/api/requests/${requestId}`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling request:', error);
      alert('Error cancelling request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'accepted': return '#10b981';
      case 'declined': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const RequestCard = ({ request, type }) => (
    <div className="card" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {request.book.image && (
          <img 
            src={`http://localhost:5000/uploads/${request.book.image}`} 
            alt={request.book.title}
            style={{ 
              width: '80px', 
              height: '120px', 
              objectFit: 'cover',
              borderRadius: '8px',
              flexShrink: 0
            }}
          />
        )}
        
        <div style={{ flex: 1 }}>
          <h3 className="text-lg font-bold">{request.book.title}</h3>
          <p className="text-sm" style={{ color: '#6b7280' }}>by {request.book.author}</p>
          
          <div style={{ marginTop: '8px' }}>
            <p className="text-sm">
              <strong>Status:</strong> <span style={{ color: getStatusColor(request.status) }}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </p>
            
            {type === 'sent' ? (
              <p className="text-sm">
                <strong>Owner:</strong> {request.owner.name}
              </p>
            ) : (
              <p className="text-sm">
                <strong>Requester:</strong> {request.requester.name}
              </p>
            )}
            
            {request.message && (
              <p className="text-sm" style={{ marginTop: '8px' }}>
                <strong>Message:</strong> {request.message}
              </p>
            )}
            
            {request.responseMessage && (
              <p className="text-sm" style={{ marginTop: '8px', color: '#6b7280' }}>
                <strong>Response:</strong> {request.responseMessage}
              </p>
            )}
          </div>
          
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {type === 'sent' && request.status === 'pending' && (
              <button 
                onClick={() => handleCancel(request._id)}
                className="btn btn-danger"
                style={{ fontSize: '14px', padding: '6px 12px' }}
              >
                Cancel Request
              </button>
            )}
            
            {type === 'received' && request.status === 'pending' && (
              <>
                <button 
                  onClick={() => handleRespond(request._id, 'accepted')}
                  className="btn btn-success"
                  style={{ fontSize: '14px', padding: '6px 12px' }}
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleRespond(request._id, 'declined')}
                  className="btn btn-danger"
                  style={{ fontSize: '14px', padding: '6px 12px' }}
                >
                  Decline
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center p-6">Loading requests...</div>;
  }

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">Book Requests</h1>
      
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e5e7eb' }}>
          <button
            onClick={() => setActiveTab('sent')}
            className="btn"
            style={{
              backgroundColor: activeTab === 'sent' ? '#3b82f6' : 'transparent',
              color: activeTab === 'sent' ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              padding: '12px 24px'
            }}
          >
            Sent Requests ({sentRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className="btn"
            style={{
              backgroundColor: activeTab === 'received' ? '#3b82f6' : 'transparent',
              color: activeTab === 'received' ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              padding: '12px 24px'
            }}
          >
            Received Requests ({receivedRequests.length})
          </button>
        </div>
      </div>

      {activeTab === 'sent' ? (
        <div>
          {sentRequests.length === 0 ? (
            <div className="card text-center">
              <h2 className="text-xl mb-4">No sent requests</h2>
              <p style={{ color: '#6b7280' }}>
                You haven't sent any book requests yet. Browse books to make your first request!
              </p>
            </div>
          ) : (
            sentRequests.map(request => (
              <RequestCard key={request._id} request={request} type="sent" />
            ))
          )}
        </div>
      ) : (
        <div>
          {receivedRequests.length === 0 ? (
            <div className="card text-center">
              <h2 className="text-xl mb-4">No received requests</h2>
              <p style={{ color: '#6b7280' }}>
                You haven't received any book requests yet. Add books to start receiving requests!
              </p>
            </div>
          ) : (
            receivedRequests.map(request => (
              <RequestCard key={request._id} request={request} type="received" />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Requests;
