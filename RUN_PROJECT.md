# How to Run ForumHub 🚀

To start the project, you need to run both the backend and frontend servers in separate terminal windows.

## 1. Start the Backend (API Server)
1. Open a terminal.
2. Navigate to the `server` directory.
3. Run the following command:
   ```bash
   npm run dev
   ```
   *The backend will run on **http://localhost:5000***

## 2. Start the Frontend (Client)
1. Open a second terminal.
2. Navigate to the `client` directory.
3. Run the following command:
   ```bash
   npm run dev
   ```
   *The frontend will run on **http://localhost:3000*** (or your local IP)*

---

**Note:** Ensure you have your MongoDB connection string in `server/.env` before starting the backend.
