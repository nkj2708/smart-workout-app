// Smoke test script for backend API
import { calculateBMI, generateWorkoutRecommendation, chatWithFitnessCoach } from './services/geminiService.js';

async function runTests() {
  console.log('--- RUNNING FITGENIUS AI SYSTEM TESTS ---');

  // Test 1: BMI Calculation
  const bmiResult = calculateBMI(75, 180);
  console.log('Test 1 (BMI Calculation):', bmiResult);
  if (bmiResult.bmi !== 23.1 || bmiResult.category !== 'Normal weight') {
    throw new Error('BMI calculation failed');
  }
  console.log('✅ Test 1 Passed: BMI calculated accurately');

  // Test 2: Recommendation Engine (Local / Gemini)
  console.log('Test 2 (Workout Recommendation Engine)...');
  const plan = await generateWorkoutRecommendation({
    name: 'Test Runner',
    age: 26,
    gender: 'male',
    heightCm: 180,
    weightKg: 75,
    fitnessGoal: 'muscle_building',
    fitnessLevel: 'intermediate',
    availableEquipment: ['dumbbells', 'bodyweight'],
    workoutDaysPerWeek: 4,
    sessionDurationMinutes: 45
  });

  console.log(`Plan Title: ${plan.planTitle}`);
  console.log(`Weekly schedule days: ${plan.weeklySchedule?.length}`);
  console.log(`Target calories: ${plan.nutritionAdvice?.caloriesTarget} kcal, Protein: ${plan.nutritionAdvice?.proteinGrams}g`);
  if (!plan.weeklySchedule || plan.weeklySchedule.length !== 4) {
    throw new Error('Recommendation plan schedule mismatch');
  }
  console.log('✅ Test 2 Passed: Multi-day workout & nutrition generation verified');

  // Test 3: AI Coach Chat Engine
  console.log('Test 3 (AI Coach Chat Response)...');
  const coachReply = await chatWithFitnessCoach(
    [],
    'My shoulder hurts during overhead press. What is an alternative?',
    { fitnessGoal: 'muscle_building' }
  );
  console.log('Coach Reply Preview:', coachReply.substring(0, 120) + '...');
  if (!coachReply || coachReply.length < 10) {
    throw new Error('Coach reply was empty');
  }
  console.log('✅ Test 3 Passed: AI Fitness Coach conversation validated');

  console.log('--- ALL BACKEND TESTS COMPLETED SUCCESSFULLY ✅ ---');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
