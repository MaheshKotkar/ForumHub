# Setup Instructions for ForumHub MERN Stack

## Quick Start Guide

### Step 1: Backend Setup (5 minutes)

1. Open Terminal/Command Prompt
2. Navigate to server directory:
   ```bash
   cd server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Environment is already configured in `.env` file

5. Start the backend:
   ```bash
   npm run dev
   ```

✅ Backend should now be running on `http://localhost:5000`

### Step 2: MongoDB Setup (2 minutes)

1. Ensure MongoDB is installed and running
2. MongoDB will automatically create the `forumhub` database when the server starts
3. No manual database setup required!

### Step 3: Frontend Setup (5 minutes)

1. Open a NEW terminal (keep backend running)
2. Navigate to client directory:
   ```bash
   cd client
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Copy the logo asset:
   ```bash
   # Windows
   mkdir public\\assets
   copy ..\\assets\\logo2.jpg public\\assets\\

   # Or manually copy logo2.jpg from root/assets to client/public/assets
   ```

5. Start the frontend:
   ```bash
   npm run dev
   ```

✅ Frontend should now be running on `http://localhost:3000`

### Step 4: Test the Application

1. Open browser and go to `http://localhost:3000`
2. Click "Sign Up" to create a new account
3. Fill in the registration form
4. Login with your credentials
5. Try creating a post with an image
6. View your dashboard

## Creating an Admin Account

Run this in MongoDB shell or MongoDB Compass:

```javascript
use forumhub

// First, hash the password using bcrypt online tool or Node.js
// For password "admin123", use this pre-hashed value:
db.admins.insertOne({
  email: "admin@example.com",
  password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
  createdAt: new Date()
})
```

Then login at `/admin` with:
- Email: admin@example.com
- Password: admin123

## Troubleshooting

### Backend won't start
- Make sure port 5000 is not in use
- Check MongoDB is running: `mongod --version`
- Verify all dependencies installed: `npm install`

### Frontend won't start
- Make sure port 3000 is not in use
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then reinstall

### Can't upload files
- Check `uploads` folder exists in `/server`
- Verify file permissions
- Check browser console for errors

### MongoDB connection failed
- Start MongoDB service (Windows: `net start MongoDB`)
- Check connection string in `.env`
- Try: `mongodb://127.0.0.1:27017/forumhub` if localhost doesn't work

## What's Next?

After setup, you can:
1. Create user accounts and test authentication
2. Create posts with images/videos
3. Test category filtering and search
4. Submit feedback
5. Test the dashboard features

## Need to Stop the Servers?

- Press `Ctrl+C` in each terminal to stop the servers

## Project Structure

```
✅ Backend: Node.js + Express + MongoDB (Port 5000)
✅ Frontend: React + Vite (Port 3000)
✅ Database: MongoDB (Port 27017)
```

Happy Coding! 🚀
