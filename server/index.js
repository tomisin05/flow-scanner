import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import flowRoutes from './routes/flows.js';
import userRoutes from './routes/users.js';
import statsRoutes from './routes/stats.js';
import { auth } from './firebase-admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Firebase Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
app.use('/api/flows', authenticateUser, flowRoutes);
app.use('/api/users', authenticateUser, userRoutes);
app.use('/api/stats', authenticateUser, statsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});