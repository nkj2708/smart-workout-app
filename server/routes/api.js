import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { WorkoutPlan } from '../models/WorkoutPlan.js';
import { ProgressLog } from '../models/ProgressLog.js';
import {
  calculateBMI,
  generateWorkoutRecommendation,
  chatWithFitnessCoach,
} from '../services/geminiService.js';

export const router = express.Router();

// In-Memory store fallback when MongoDB is not running locally
const memoryStore = {
  users: [],
  workoutPlans: [],
  progressLogs: [
    {
      _id: 'mock-1',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      workoutTitle: 'Upper Body Power & Hypertrophy',
      durationMinutes: 45,
      caloriesBurned: 340,
      weightKg: 72.5,
      bmi: 23.7,
      intensity: 'Challenging',
      notes: 'Strong bench press set today.'
    },
    {
      _id: 'mock-2',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      workoutTitle: 'Lower Body Strength & Stability',
      durationMinutes: 50,
      caloriesBurned: 410,
      weightKg: 72.3,
      bmi: 23.6,
      intensity: 'Extreme',
      notes: 'Hit 4 sets of goblet squats.'
    },
    {
      _id: 'mock-3',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      workoutTitle: 'Aerobic Conditioning & Core Engine',
      durationMinutes: 40,
      caloriesBurned: 310,
      weightKg: 71.9,
      bmi: 23.5,
      intensity: 'Moderate',
      notes: 'HIIT intervals felt smooth.'
    },
    {
      _id: 'mock-4',
      date: new Date().toISOString(),
      workoutTitle: 'Functional Full-Body Integration',
      durationMinutes: 45,
      caloriesBurned: 380,
      weightKg: 71.6,
      bmi: 23.4,
      intensity: 'Challenging',
      notes: 'Energy was very high post-workout.'
    }
  ]
};

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * GET /api/health
 * System health & integration status
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: isDbConnected() ? 'MongoDB Connected' : 'In-Memory Mock Active (Zero-config mode)',
    geminiApiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim())
  });
});

/**
 * POST /api/recommendations/generate
 * Dynamic AI Workout Generation via Gemini API
 */
router.post('/recommendations/generate', async (req, res) => {
  try {
    const userData = req.body;
    const { bmi, category } = calculateBMI(userData.weightKg, userData.heightCm);

    console.log(`[API] Generating recommendation for Goal: ${userData.fitnessGoal}, BMI: ${bmi}`);
    const recommendation = await generateWorkoutRecommendation({
      ...userData,
      bmi,
      bmiCategory: category
    });

    // If MongoDB is connected, save user & generated plan
    if (isDbConnected()) {
      try {
        const savedUser = await User.create({
          ...userData,
          bmi,
          bmiCategory: category
        });

        const savedPlan = await WorkoutPlan.create({
          userId: savedUser._id,
          ...recommendation
        });
        recommendation._id = savedPlan._id;
      } catch (dbErr) {
        console.warn('[API] MongoDB save error (continuing):', dbErr.message);
      }
    } else {
      recommendation._id = 'plan-' + Date.now();
      memoryStore.workoutPlans.unshift(recommendation);
    }

    res.json({
      success: true,
      data: recommendation,
      source: process.env.GEMINI_API_KEY ? 'Gemini 1.5 Flash API' : 'Smart Local AI Engine'
    });
  } catch (error) {
    console.error('[API] Recommendation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/coach/chat
 * Real-time Conversational Gemini Fitness Coach
 */
router.post('/coach/chat', async (req, res) => {
  try {
    const { history = [], message = '', userContext = {} } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const reply = await chatWithFitnessCoach(history, message, userContext);
    res.json({
      success: true,
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API] Coach chat error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/workouts
 * Retrieve latest saved workout plans
 */
router.get('/workouts', async (req, res) => {
  try {
    if (isDbConnected()) {
      const plans = await WorkoutPlan.find().sort({ createdAt: -1 }).limit(10);
      return res.json({ success: true, data: plans });
    }
    res.json({ success: true, data: memoryStore.workoutPlans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/workouts
 * Save or bookmark a workout plan
 */
router.post('/workouts', async (req, res) => {
  try {
    const planData = req.body;
    if (isDbConnected()) {
      const saved = await WorkoutPlan.create(planData);
      return res.status(201).json({ success: true, data: saved });
    }
    planData._id = 'plan-' + Date.now();
    memoryStore.workoutPlans.unshift(planData);
    res.status(201).json({ success: true, data: planData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/progress
 * Retrieve progress logs for Recharts analytics
 */
router.get('/progress', async (req, res) => {
  try {
    if (isDbConnected()) {
      const logs = await ProgressLog.find().sort({ date: 1 });
      return res.json({ success: true, data: logs });
    }
    res.json({ success: true, data: memoryStore.progressLogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/progress
 * Log a completed workout session with health & volume metrics
 */
router.post('/progress', async (req, res) => {
  try {
    const logData = req.body;
    if (isDbConnected()) {
      const saved = await ProgressLog.create(logData);
      return res.status(201).json({ success: true, data: saved });
    }
    const newLog = {
      _id: 'log-' + Date.now(),
      date: new Date().toISOString(),
      ...logData
    };
    memoryStore.progressLogs.push(newLog);
    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
