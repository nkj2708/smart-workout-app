import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  targetMuscle: { type: String, required: true },
  sets: { type: Number, required: true, default: 3 },
  reps: { type: String, required: true, default: '10-12' },
  restSeconds: { type: Number, default: 60 },
  equipment: { type: String, default: 'bodyweight' },
  formCue: { type: String, default: 'Maintain steady breathing and neutral spine.' },
  alternativeExercise: { type: String, default: '' }
});

const DayPlanSchema = new mongoose.Schema({
  dayName: { type: String, required: true }, // e.g., 'Day 1: Upper Body Strength'
  focus: { type: String, required: true },
  durationMinutes: { type: Number, default: 45 },
  warmup: { type: [String], default: [] },
  exercises: [ExerciseSchema],
  cooldown: { type: [String], default: [] }
});

const WorkoutPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    planTitle: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    fitnessGoal: {
      type: String,
      required: true,
    },
    fitnessLevel: {
      type: String,
      required: true,
    },
    weeklySchedule: [DayPlanSchema],
    nutritionAdvice: {
      caloriesTarget: { type: Number, default: 2200 },
      proteinGrams: { type: Number, default: 130 },
      carbsGrams: { type: Number, default: 240 },
      fatsGrams: { type: Number, default: 65 },
      recommendations: { type: [String], default: [] }
    },
    isCurrentPlan: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const WorkoutPlan = mongoose.models.WorkoutPlan || mongoose.model('WorkoutPlan', WorkoutPlanSchema);
