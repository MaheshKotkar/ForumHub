# ForumHub Backend

Node.js + Express + MongoDB backend for ForumHub application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/forumhub
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Make sure MongoDB is running

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (requires token)
- POST `/api/auth/logout` - Logout user

### Posts
- GET `/api/posts` - Get all posts (with search & category filters)
- GET `/api/posts/:id` - Get single post
- POST `/api/posts` - Create new post (requires token, supports file upload)
- PUT `/api/posts/:id` - Update post (requires token)
- DELETE `/api/posts/:id` - Delete post (requires token)
- GET `/api/posts/user/:userId` - Get user's posts

### Comments
- GET `/api/comments/post/:postId` - Get all comments for a post
- POST `/api/comments` - Add comment (requires token)
- DELETE `/api/comments/:id` - Delete comment (requires token)

### Reactions
- POST `/api/reactions` - Add/update reaction (requires token)
- GET `/api/reactions/post/:postId` - Get reactions for a post

### Feedback
- POST `/api/feedback` - Submit feedback (requires token)
- GET `/api/feedback` - Get all feedback (admin only)

### Admin
- POST `/api/admin/login` - Admin login
- GET `/api/admin/users` - Get all users (admin only)
- DELETE `/api/admin/users/:id` - Delete user (admin only)
- DELETE `/api/admin/posts/:id` - Delete post (admin only)
- DELETE `/api/admin/comments/:id` - Delete comment (admin only)
- GET `/api/admin/alerts/:userId` - Get deletion alerts
- DELETE `/api/admin/alerts/:id` - Dismiss alert

## Features

- JWT Authentication
- File upload (images & videos)
- Comment nesting (replies)
- Like/Dislike reactions
- Privacy controls (public/private posts)
- Search & category filtering
- Admin moderation system
- Deletion alerts

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Bcrypt for password hashing
