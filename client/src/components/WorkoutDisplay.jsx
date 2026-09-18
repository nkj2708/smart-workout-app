import React, { useState } from 'react';
import { 
  Dumbbell, 
  Flame, 
  CheckCircle, 
  Clock, 
  RotateCcw, 
  Utensils, 
  ShieldCheck, 
  Info,
  Calendar,
  Zap,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

export default function WorkoutDisplay({ plan, onLogWorkout, isLogging }) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState({});
  const [loggedSuccess, setLoggedSuccess] = useState(false);

  if (!plan || !plan.weeklySchedule || plan.weeklySchedule.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-800 text-slate-500">
          <Dumbbell className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Active Routine Generated Yet</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
          Head over to the AI Routine Generator, input your metrics, and let Gemini craft your custom program.
        </p>
      </div>
    );
  }

  const currentDay = plan.weeklySchedule[activeDayIndex] || plan.weeklySchedule[0];
  const { nutritionAdvice } = plan;

  const toggleExerciseCheck = (idx) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [`${activeDayIndex}-${idx}`]: !prev[`${activeDayIndex}-${idx}`]
    }));
  };

  const handleLogSession = async () => {
    const exercisesDone = currentDay.exercises.map((ex, i) => ({
      name: ex.name,
      setsCompleted: ex.sets,
      reps: ex.reps,
      completed: !!completedExercises[`${activeDayIndex}-${i}`]
    }));

    const result = await onLogWorkout({
      workoutTitle: `${plan.planTitle} - ${currentDay.dayName}`,
      durationMinutes: currentDay.durationMinutes || 45,
      caloriesBurned: Math.round((currentDay.durationMinutes || 45) * 8.5),
      weightKg: plan.bmi ? +(22 * ((1.75) ** 2)).toFixed(1) : 72,
      bmi: plan.bmi || 23.5,
      intensity: 'Challenging',
      completedExercises: exercisesDone,
      notes: `Finished ${currentDay.dayName} with strong momentum.`
    });

    if (result) {
      setLoggedSuccess(true);
      setTimeout(() => setLoggedSuccess(false), 3500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Plan Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                {plan.fitnessGoal?.replace('_', ' ')}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold capitalize">
                Level: {plan.fitnessLevel}
              </span>
              {plan.bmi && (
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                  BMI: {plan.bmi} ({plan.bmiCategory})
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {plan.planTitle}
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              {plan.summary}
            </p>
          </div>

          <button
            onClick={handleLogSession}
            disabled={isLogging}
            className="self-start md:self-center px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{isLogging ? 'Logging...' : 'Log Completed Workout'}</span>
          </button>
        </div>

        {loggedSuccess && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <Award className="w-4 h-4" />
            <span>Workout logged successfully to MongoDB! Analytics dashboard updated.</span>
          </div>
        )}
      </div>

      {/* Nutrition & Recovery Blueprint */}
      {nutritionAdvice && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-4">
            <Utensils className="w-4 h-4 text-emerald-400" />
            Personalized Macro & Nutrition Blueprint
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Target Calories</span>
              <p className="text-xl font-black text-white mt-1">{nutritionAdvice.caloriesTarget || 2300} <span className="text-xs font-normal text-slate-400">kcal</span></p>
            </div>
            <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Protein</span>
              <p className="text-xl font-black text-emerald-400 mt-1">{nutritionAdvice.proteinGrams || 140} <span className="text-xs font-normal text-slate-400">g</span></p>
            </div>
            <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Carbohydrates</span>
              <p className="text-xl font-black text-teal-400 mt-1">{nutritionAdvice.carbsGrams || 240} <span className="text-xs font-normal text-slate-400">g</span></p>
            </div>
            <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Healthy Fats</span>
              <p className="text-xl font-black text-amber-400 mt-1">{nutritionAdvice.fatsGrams || 65} <span className="text-xs font-normal text-slate-400">g</span></p>
            </div>
          </div>
          {nutritionAdvice.recommendations && nutritionAdvice.recommendations.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-2">
              {nutritionAdvice.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Day Split Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
        {plan.weeklySchedule.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setActiveDayIndex(idx)}
            className={`px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 flex items-center gap-2 ${
              activeDayIndex === idx
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{day.dayName.split(':')[0]}</span>
          </button>
        ))}
      </div>

      {/* Active Day Detail */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">{currentDay.dayName}</h2>
            <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Target Focus: {currentDay.focus}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Estimated Duration: {currentDay.durationMinutes || 45} mins</span>
          </div>
        </div>

        {/* Warmup */}
        {currentDay.warmup && currentDay.warmup.length > 0 && (
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4" /> Dynamic Warmup Protocol (5-8 Mins)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {currentDay.warmup.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercises List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-emerald-400" />
            Exercise Progression & Biomechanics
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {currentDay.exercises.map((ex, idx) => {
              const isDone = !!completedExercises[`${activeDayIndex}-${idx}`];
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all duration-200 ${
                    isDone
                      ? 'bg-slate-950/40 border-emerald-500/30 opacity-70'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleExerciseCheck(idx)}
                        className={`w-6 h-6 rounded-lg border mt-0.5 flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'border-slate-700 bg-slate-900 hover:border-emerald-500'
                        }`}
                      >
                        {isDone && <CheckCircle className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className={`text-base font-extrabold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                            {ex.name}
                          </h4>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {ex.targetMuscle}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {ex.equipment}
                          </span>
                        </div>

                        {/* Form Cue */}
                        <p className="text-xs text-slate-400 mt-2 flex items-start gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span><strong className="text-slate-300 font-semibold">Biomechanical Cue:</strong> {ex.formCue}</span>
                        </p>

                        {/* Alternative */}
                        {ex.alternativeExercise && (
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                            <span>Alternative / Swap: <span className="text-slate-300">{ex.alternativeExercise}</span></span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Sets & Reps Specs */}
                    <div className="text-right flex-shrink-0">
                      <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
                        <span className="text-sm font-black text-emerald-400">{ex.sets}</span>
                        <span className="text-xs text-slate-400"> sets × </span>
                        <span className="text-sm font-black text-white">{ex.reps}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-1">
                        Rest: {ex.restSeconds || 60}s
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cooldown */}
        {currentDay.cooldown && currentDay.cooldown.length > 0 && (
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4" /> Static Stretch & Cool-down (3-5 Mins)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {currentDay.cooldown.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
