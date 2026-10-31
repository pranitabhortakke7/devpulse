const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://devpulse-five-lovat.vercel.app'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const githubRoutes = require('./routes/github');
const aiRoutes = require('./routes/ai');

app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/ai', aiRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'DevPulse API is running 🚀' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);

  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not configured; authentication will not work.');
  }

  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not configured; database-backed routes will not work.');
    return;
  }

  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB Connected');
    })
    .catch((err) => {
      console.error('❌ DB Connection Error:', err);
    });
});