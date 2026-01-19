# ForumHub

## Overview

ForumHub is a community forum platform where users can create accounts, post content with images/videos, comment, react to posts, and provide feedback. Now rebuilt with modern MERN stack architecture.

## Tech Stack

### Backend
- **Node.js** v20.x LTS
- **Express.js** v4.x
- **MongoDB** v7.x with Mongoose v8.x
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Nodemailer** for email services

### Frontend
- **React** v18.x
- **Vite** v5.x (build tool)
- **React Router** v6.x
- **Axios** for API calls
- **Bootstrap** v5.3.0
- **Bootstrap Icons**
- **Chart.js** for dashboards

## 📁 Project Structure

```
forum-project-DMS/
├── server/                    # Backend (Node.js + Express)
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth, upload, error handling
│   ├── config/               # Database configuration
│   ├── uploads/              # Uploaded files
│   ├── seedAdmin.js          # Admin account seeder
│   ├── server.js             # Main server file
│   └── package.json
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── context/          # Global state (Auth)
│   │   ├── services/         # API service functions
│   │   ├── styles/           # CSS files
│   │   └── App.jsx
│   ├── public/
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.x or later)
- MongoDB (v7.x or later)
- npm or yarn

### Installation

#### 1. Install Backend Dependencies

```bash
cd server
npm install
```

#### 2. Configure Environment Variables

Create `.env` file in `/server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/forumhub
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
JWT_EXPIRE=7d
NODE_ENV=development
```

#### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows (if installed as service)
net start MongoDB

# OR start manually
mongod
```

#### 4. Seed Admin Account

Initialize the default admin account:

```bash
npm run seed:admin
```
_This will create an admin user with email `admin@example.com` and password `admin123`._

#### 5. Install Frontend Dependencies

```bash
cd ../client
npm install
```

#### 6. Copy Logo Asset

Copy the logo from the original project to the React public folder:

```bash
# Create assets directory
mkdir public/assets

# Copy logo
copy ../assets/logo2.jpg public/assets/
```

### Running the Application

#### Start Backend Server (Terminal 1)

```bash
cd server
npm run dev
```

Server runs on: `http://localhost:5000`

#### Start Frontend (Terminal 2)

```bash
cd client
npm run dev
```

Frontend runs on: `http://localhost:3000`

## ✨ Features Implemented

### User Features
✅ **User Registration & Login**: Secure authentication using JWT.
✅ **Create, Edit, Delete Posts**: Full CRUD operations for user posts.
✅ **Media Uploads**: Support for images and videos with posts.
✅ **Interactive Content**: Like/Dislike reactions on posts.
✅ **Comments System**: Threaded comments and replies.
✅ **Post Privacy**: Option to make posts public or private.
✅ **Category Filtering**: Filter posts by categories (Health, Technology, etc.).
✅ **Search**: Search functionality for finding posts.
✅ **User Dashboard**: Profile management and post statistics.
✅ **Post Details**: Detailed view of posts with comments and interactions.
✅ **Contact Form**: Users can submit inquiries.

### Admin Features
✅ **Admin Authentication**: Secure login for administrators.
✅ **Dashboard**: Overview of system statistics.
✅ **User Management**: View and ban/delete users.
✅ **Content Moderation**: Ability to delete inappropriate posts and comments.
✅ **Deletion Alerts**: Automated notifications to users when their content is removed.

## 📱 Pages

- **Home Page** (`/`) - Hero section, post feed, category filters.
- **Login** (`/login`) - User authentication.
- **Signup** (`/signup`) - New user registration.
- **Forgot Password** (`/forgot-password`) - Password recovery flow.
- **Dashboard** (`/dashboard`) - User profile, performance stats, 'My Posts'.
- **Post Detail** (`/post/:id`) - Full post view, comments section.
- **Edit Post** (`/post/:id/edit`) - Update existing posts.
- **Admin Login** (`/admin`) - Specialized login for admins.
- **Admin Dashboard** (`/admin/dashboard`) - Central hub for moderation.

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/forgotpassword` - Request password reset
- `PUT /api/auth/resetpassword/:resetToken` - Reset password

### Posts
- `GET /api/posts` - Get all posts (supports pagination & filtering)
- `GET /api/posts/:id` - Get single post details
- `POST /api/posts` - Create new post (Multipart form-data)
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### Comments
- `GET /api/comments/post/:postId` - Get comments for a post
- `POST /api/comments` - Add a new comment
- `DELETE /api/comments/:id` - Delete a comment

### Reactions
- `POST /api/reactions` - Toggle Like/Dislike
- `GET /api/reactions/post/:postId` - Get reaction counts

### Feedback & Contact
- `POST /api/feedback` - Submit user feedback
- `POST /api/contact` - Submit contact form

### Admin
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/users` - List all registered users
- `DELETE /api/admin/users/:id` - Delete a user
- `DELETE /api/admin/posts/:id` - Delete any post
- `DELETE /api/admin/comments/:id` - Delete any comment
- `GET /api/admin/alerts/:userId` - Get deletion alerts for a user
- `DELETE /api/admin/alerts/:id` - Dismiss an alert

## 🔧 Next Steps

### Enhancements
1. **Real-time Features**: Implement WebSockets for live notifications and chat.
2. **Production Optimizations**: Image optimization, lazy loading, and code splitting.
3. **Advanced Search**: Full-text search with ElasticSearch or similar.

## 🎨 UI Design

The UI has been carefully preserved from the original PHP version while upgrading the underlying technology:
- **Framework**: Bootstrap 5.3.0
- **Theme**: Custom dark/light mode aesthetics matching the original design.
- **Experience**: Single Page Application (SPA) for smooth transitions without reloads.

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB service is running.
- Check `MONGODB_URI` in `.env`.

### CORS Errors
- Backend CORS is configured in `server.js` to accept requests from frontend.
- Vite proxy is configured in `vite.config.js`.

### File Upload Issues
- `uploads/` directory in `/server` is auto-created.
- Check file size limits in `middleware/upload.js`.

## 🤝 Contributing

This project is a migration of an existing PHP forum to the MERN stack.

## 📝 License

MIT

---

**Made with ❤️ - Successfully migrated to MERN Stack!**
