import mongoose from 'mongoose';

const ProgressLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    workoutTitle: {
      type: String,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 45,
    },
    caloriesBurned: {
      type: Number,
      default: 320,
    },
    weightKg: {
      type: Number,
      required: false,
    },
    bmi: {
      type: Number,
      required: false,
    },
    completedExercises: [
      {
        name: String,
        setsCompleted: Number,
        reps: String,
        weightUsedKg: Number,
      }
    ],
    notes: {
      type: String,
      default: '',
    },
    intensity: {
      type: String,
      enum: ['Easy', 'Moderate', 'Challenging', 'Extreme'],
      default: 'Moderate',
    }
  },
  { timestamps: true }
);

export const ProgressLog = mongoose.models.ProgressLog || mongoose.model('ProgressLog', ProgressLogSchema);
