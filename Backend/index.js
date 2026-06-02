import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import githubRouter from './githubRoute.js'; // Ensure file name matches perfectly

dotenv.config();
const app = express();
const PORT = 5000;

// 1. Enable CORS so your React frontend (usually port 5173) can talk to your backend
app.use(cors());

// 2. Body parsers for standard JSON/URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Mount your router file directly to the /api prefix
app.use('/api', githubRouter);

// Simple health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: "Backend is up and running!" });
});

app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});