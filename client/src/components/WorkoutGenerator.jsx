import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Dumbbell, 
  Target, 
  Flame, 
  Heart, 
  Activity, 
  Calendar, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';

export default function WorkoutGenerator({ onGeneratePlan, isGenerating }) {
  const [formData, setFormData] = useState({
    name: 'Alex',
    age: 24,
    gender: 'male',
    heightCm: 178,
    weightKg: 74,
    fitnessGoal: 'muscle_building',
    fitnessLevel: 'intermediate',
    availableEquipment: ['dumbbells', 'bodyweight'],
    workoutDaysPerWeek: 4,
    sessionDurationMinutes: 45,
    dietaryPreference: 'high-protein',
    medicalLimitations: 'None',
  });

  // Calculate live BMI
  const { bmi, bmiCategory, bmiColor, bmiAdvice } = useMemo(() => {
    const hM = formData.heightCm / 100;
    if (!hM || !formData.weightKg) return { bmi: 22, bmiCategory: 'Normal weight', bmiColor: 'text-emerald-400', bmiAdvice: 'Healthy range' };
    const val = +(formData.weightKg / (hM * hM)).toFixed(1);
    if (val < 18.5) {
      return { bmi: val, bmiCategory: 'Underweight', bmiColor: 'text-amber-400', bmiAdvice: 'Caloric surplus recommended for lean muscle gain' };
    } else if (val < 25) {
      return { bmi: val, bmiCategory: 'Normal weight', bmiColor: 'text-emerald-400', bmiAdvice: 'Ideal baseline for progressive overload & recomp' };
    } else if (val < 30) {
      return { bmi: val, bmiCategory: 'Overweight', bmiColor: 'text-amber-500', bmiAdvice: 'High-density resistance + cardio deficit recommended' };
    } else {
      return { bmi: val, bmiCategory: 'Obese', bmiColor: 'text-rose-400', bmiAdvice: 'Low-impact progressive conditioning prioritized' };
    }
  }, [formData.heightCm, formData.weightKg]);

  const goals = [
    { id: 'muscle_building', label: 'Hypertrophy & Muscle Gain', icon: Dumbbell, desc: 'Progressive overload, high volume, targeted hypertrophy' },
    { id: 'weight_loss', label: 'Fat Loss & Conditioning', icon: Flame, desc: 'Metabolic resistance circuits, caloric expenditure, lean tone' },
    { id: 'strength', label: 'Raw Strength & Power', icon: Target, desc: 'Compound movements, lower rep ranges, neuromuscular drive' },
    { id: 'endurance', label: 'Cardio & Stamina Engine', icon: Heart, desc: 'Aerobic intervals, lactate threshold training, sustained stamina' },
    { id: 'flexibility', label: 'Mobility & Joint Longevity', icon: Activity, desc: 'Corrective mechanics, posture restoration, flexibility' },
  ];

  const equipmentOptions = [
    { id: 'bodyweight', label: 'Bodyweight / Calisthenics' },
    { id: 'dumbbells', label: 'Dumbbells' },
    { id: 'resistance_bands', label: 'Resistance Bands' },
    { id: 'barbell', label: 'Barbell & Plates' },
    { id: 'gym', label: 'Full Commercial Gym Machines' },
    { id: 'kettlebell', label: 'Kettlebells' },
  ];

  const toggleEquipment = (id) => {
    setFormData((prev) => {
      const exists = prev.availableEquipment.includes(id);
      if (exists) {
        if (prev.availableEquipment.length === 1) return prev; // keep at least 1
        return { ...prev, availableEquipment: prev.availableEquipment.filter(item => item !== id) };
      } else {
        return { ...prev, availableEquipment: [...prev.availableEquipment, id] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGeneratePlan(formData);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-8 border border-slate-800 shadow-2xl mb-8">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Gemini AI Workout Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Generate Your Scientific Fitness Regimen
          </h1>
          <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
            Our AI engine integrates your calculated BMI, equipment inventory, and biological recovery curves to engineer a personalized, periodized workout split and macronutrient blueprint.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Biometrics & Live BMI */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                1. Biometrics & BMI Assessment
              </h2>
              <p className="text-xs text-slate-400 mt-1">Calculated in real-time according to WHO standards</p>
            </div>
            {/* Live BMI Pill */}
            <div className="text-right">
              <div className="inline-flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">BMI:</span>
                <span className={`text-lg font-black ${bmiColor}`}>{bmi}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 font-semibold">
                  {bmiCategory}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{bmiAdvice}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name / Alias
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Age
              </label>
              <input
                type="number"
                min="14"
                max="90"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                min="100"
                max="240"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                min="35"
                max="250"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Fitness Goal */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-emerald-400" />
            2. Primary Fitness Objective
          </h2>
          <p className="text-xs text-slate-400 mb-6">Gemini adjusts rep tempos, rest intervals, and volume density accordingly</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((g) => {
              const Icon = g.icon;
              const isSelected = formData.fitnessGoal === g.id;
              return (
                <div
                  key={g.id}
                  onClick={() => setFormData({ ...formData, fitnessGoal: g.id })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/40'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">{g.label}</h3>
                    <p className="text-xs text-slate-400">{g.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setFormData({ ...formData, fitnessLevel: lvl })}
                    className={`py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                      formData.fitnessLevel === lvl
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Dietary Preference
              </label>
              <select
                value={formData.dietaryPreference}
                onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="high-protein">High-Protein Standard</option>
                <option value="balanced">Balanced Macro Ratio</option>
                <option value="plant-based-vegan">Plant-Based / Vegan</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="keto-lowcarb">Ketogenic / Low-Carb</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Equipment & Logistics */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
            3. Equipment & Availability
          </h2>
          <p className="text-xs text-slate-400 mb-6">Select all equipment accessible to you</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {equipmentOptions.map((eq) => {
              const isSelected = formData.availableEquipment.includes(eq.id);
              return (
                <button
                  type="button"
                  key={eq.id}
                  onClick={() => toggleEquipment(eq.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>{eq.label}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Frequency ({formData.workoutDaysPerWeek} Days / Week)
                </label>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                value={formData.workoutDaysPerWeek}
                onChange={(e) => setFormData({ ...formData, workoutDaysPerWeek: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>2 Days</span>
                <span>3 Days</span>
                <span>4 Days</span>
                <span>5 Days</span>
                <span>6 Days</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Target Session Duration
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[30, 45, 60].map((mins) => (
                  <button
                    type="button"
                    key={mins}
                    onClick={() => setFormData({ ...formData, sessionDurationMinutes: mins })}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      formData.sessionDurationMinutes === mins
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {mins} Mins
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Injuries or Biomechanical Limitations (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Mild lower back fatigue, avoid high-impact jumping, clicking right shoulder..."
              value={formData.medicalLimitations}
              onChange={(e) => setFormData({ ...formData, medicalLimitations: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Generate Submit Button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-3 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Gemini AI Synthesizing Routine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Generate Smart Workout Plan</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
