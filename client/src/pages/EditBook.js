import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    condition: 'Good',
    description: '',
    category: ''
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(baseUrl + `/api/books/${id}`);
      const book = response.data;
      
      setFormData({
        title: book.title,
        author: book.author,
        condition: book.condition,
        description: book.description || '',
        category: book.category || ''
      });
      
      if (book.image) {
        setCurrentImage(book.image);
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      setError('Error loading book details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('author', formData.author);
      submitData.append('condition', formData.condition);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      
      if (image) {
        submitData.append('image', image);
      }

      await axios.put(baseUrl + `/api/books/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Book updated successfully!');
      setTimeout(() => {
        navigate('/my-books');
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating book');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading book details...</div>;
  }

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <div className="card">
        <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
        
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Book Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Author *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Condition *</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Fiction, Non-fiction, Science, etc."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Describe the book's condition, any notes, etc."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Book Image</label>
            {currentImage && (
              <div style={{ marginBottom: '12px' }}>
                <p className="text-sm mb-2">Current image:</p>
                <img 
                  src={`http://localhost:5000/uploads/${currentImage}`} 
                  alt="Current book"
                  style={{ 
                    width: '120px', 
                    height: '160px', 
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-input"
            />
            <p className="text-sm" style={{ color: '#6b7280', marginTop: '4px' }}>
              {currentImage ? 'Upload a new image to replace the current one' : 'Upload a photo of your book'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Book'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/my-books')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
