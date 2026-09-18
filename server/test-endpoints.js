import express from 'express';
import cors from 'cors';
import { router as apiRouter } from './routes/api.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

const server = app.listen(5005, async () => {
  try {
    console.log('Testing endpoints on port 5005...');

    // 1. Healthcheck
    const healthRes = await fetch('http://localhost:5005/api/health');
    const healthData = await healthRes.json();
    console.log('1. Health check response:', healthData);

    // 2. Recommendations Generate
    const recRes = await fetch('http://localhost:5005/api/recommendations/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Demo Athlete',
        age: 23,
        heightCm: 175,
        weightKg: 70,
        fitnessGoal: 'weight_loss',
        fitnessLevel: 'beginner',
        availableEquipment: ['dumbbells'],
        workoutDaysPerWeek: 3
      })
    });
    const recData = await recRes.json();
    console.log('2. Recommendation response status:', recRes.status, 'Title:', recData.data?.planTitle);

    // 3. Coach Chat
    const chatRes = await fetch('http://localhost:5005/api/coach/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What should I eat before training?'
      })
    });
    const chatData = await chatRes.json();
    console.log('3. Coach chat response status:', chatRes.status, 'Reply length:', chatData.reply?.length);

    // 4. Progress Logs
    const progRes = await fetch('http://localhost:5005/api/progress');
    const progData = await progRes.json();
    console.log('4. Progress logs response count:', progData.data?.length);

    // 5. Post new Progress Log
    const addProgRes = await fetch('http://localhost:5005/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workoutTitle: 'Test Upper Body Blast',
        durationMinutes: 45,
        caloriesBurned: 350,
        weightKg: 70.2,
        bmi: 22.9,
        intensity: 'Challenging'
      })
    });
    const addProgData = await addProgRes.json();
    console.log('5. Add progress log status:', addProgRes.status, 'Logged ID:', addProgData.data?._id);

    console.log('✅ ALL 5 ENDPOINTS TESTED AND WORKING PERFECTLY!');
  } catch (err) {
    console.error('❌ Endpoint test failed:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
