import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Fitness Enthusiast',
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 12,
      max: 100,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male',
    },
    weightKg: {
      type: Number,
      required: true,
      min: 30,
      max: 300,
    },
    heightCm: {
      type: Number,
      required: true,
      min: 100,
      max: 250,
    },
    bmi: {
      type: Number,
      required: true,
    },
    bmiCategory: {
      type: String,
      enum: ['Underweight', 'Normal weight', 'Overweight', 'Obese'],
      default: 'Normal weight',
    },
    fitnessGoal: {
      type: String,
      enum: ['weight_loss', 'muscle_building', 'endurance', 'strength', 'flexibility'],
      required: true,
    },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    availableEquipment: {
      type: [String],
      default: ['bodyweight'],
    },
    workoutDaysPerWeek: {
      type: Number,
      default: 4,
      min: 1,
      max: 7,
    },
    sessionDurationMinutes: {
      type: Number,
      default: 45,
    },
    dietaryPreference: {
      type: String,
      default: 'balanced',
    },
    medicalLimitations: {
      type: String,
      default: 'None',
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
