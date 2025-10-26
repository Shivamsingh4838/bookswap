# BookSwap Marketplace

A platform for users to exchange used books with fellow readers. Built with Node.js, Express, MongoDB, and React.

## Features

- **User Authentication**: JWT-based login/signup system
- **Book Management**: Users can post books with title, author, condition, and images
- **Book Requests**: Request system with status tracking (pending, accepted, declined)
- **User Dashboard**: Manage books and requests
- **Modern UI**: Responsive design with clean interface

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- bcryptjs for password hashing

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Context API for state management

## Installation

1. **Install dependencies for all packages:**
   ```bash
   npm run install-all
   ```

2. **Start MongoDB:**
   Make sure MongoDB is running on your system (default: mongodb://localhost:27017)

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend React app (port 3000).

## Project Structure

```
bookswap-marketplace/
├── server/                 # Backend API
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   ├── uploads/           # File uploads directory
│   └── index.js          # Server entry point
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context
│   │   └── App.js         # Main app component
└── package.json           # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Books
- `GET /api/books` - Get all available books
- `GET /api/books/my-books` - Get user's books
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/books/:id` - Get single book

### Requests
- `POST /api/requests` - Create book request
- `GET /api/requests/sent` - Get sent requests
- `GET /api/requests/received` - Get received requests
- `PUT /api/requests/:id/respond` - Respond to request
- `DELETE /api/requests/:id` - Cancel request

## Usage

1. **Register/Login**: Create an account or login to access the platform
2. **Add Books**: Post your books with details and images
3. **Browse Books**: Discover books from other users
4. **Request Books**: Send requests for books you want
5. **Manage Requests**: Accept/decline incoming requests
6. **Track Status**: Monitor your sent and received requests

## Environment Variables

Create a `.env` file in the server directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookswap
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## Development

- Backend runs on http://localhost:5000
- Frontend runs on http://localhost:3000
- File uploads are served from http://localhost:5000/uploads

## Features in Detail

### Book Management
- Add books with title, author, condition, category, and description
- Upload book images
- Edit and delete your books
- Mark books as available/unavailable

### Request System
- Send requests to book owners
- Include personal messages with requests
- Accept or decline incoming requests
- Track request status
- Cancel pending requests

### User Experience
- Responsive design for mobile and desktop
- Clean, modern interface
- Real-time status updates
- Intuitive navigation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.
