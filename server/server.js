import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { router as apiRouter } from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_fitness';

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api', apiRouter);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Fitness & Workout Recommendation System API',
    endpoints: {
      health: '/api/health',
      recommendations: '/api/recommendations/generate',
      coachChat: '/api/coach/chat',
      workouts: '/api/workouts',
      progress: '/api/progress'
    },
    documentation: 'See README.md for full specs and client setup.'
  });
});

// Graceful Database Connection
async function connectDatabase() {
  try {
    console.log(`[Database] Attempting connection to MongoDB...`);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] ✅ Connected to MongoDB successfully!`);
  } catch (err) {
    console.warn(`[Database] ⚠️ MongoDB connection skipped (${err.message}).`);
    console.warn(`[Database] 💡 Server is operating in resilient In-Memory mode. To use MongoDB, set MONGODB_URI in .env or run mongod.`);
  }
}

connectDatabase().finally(() => {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Smart Fitness API Server running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured ✅' : 'Mock/Local Fallback Active 💡'}`);
    console.log(`====================================================`);
  });
});
