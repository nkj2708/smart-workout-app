import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Flame, 
  Clock, 
  Award, 
  PlusCircle, 
  Calendar, 
  Activity,
  CheckCircle2
} from 'lucide-react';

const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#f43f5e'];

export default function ProgressDashboard({ progressLogs = [], onLogWorkout, isLogging }) {
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    workoutTitle: 'Full Body Power & Core',
    durationMinutes: 45,
    caloriesBurned: 350,
    weightKg: 72.0,
    bmi: 23.5,
    intensity: 'Challenging',
    notes: 'Completed all target sets and progressive overload.'
  });

  // KPI Calculations
  const totalWorkouts = progressLogs.length;
  const totalCalories = progressLogs.reduce((acc, log) => acc + (log.caloriesBurned || 0), 0);
  const avgDuration = totalWorkouts > 0 
    ? Math.round(progressLogs.reduce((acc, log) => acc + (log.durationMinutes || 0), 0) / totalWorkouts) 
    : 0;
  const latestWeight = progressLogs.length > 0 ? progressLogs[progressLogs.length - 1].weightKg : 72;
  const latestBmi = progressLogs.length > 0 ? progressLogs[progressLogs.length - 1].bmi : 23.5;

  // Format data for Recharts
  const chartData = progressLogs.map((log, index) => {
    const d = new Date(log.date);
    const dateFormatted = `${d.getMonth() + 1}/${d.getDate()}`;
    return {
      name: `Session ${index + 1} (${dateFormatted})`,
      shortDate: dateFormatted,
      weight: log.weightKg || 72,
      bmi: log.bmi || 23.5,
      calories: log.caloriesBurned || 300,
      duration: log.durationMinutes || 45,
      title: log.workoutTitle
    };
  });

  // Intensity distribution data
  const intensityCounts = progressLogs.reduce((acc, log) => {
    const key = log.intensity || 'Moderate';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(intensityCounts).map((key) => ({
    name: key,
    value: intensityCounts[key]
  }));

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    await onLogWorkout(manualForm);
    setShowManualModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Biometric Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Fitness Progress Dashboard</h1>
          <p className="text-slate-400 text-sm">Visualizing training volume, caloric expenditure, and BMI trajectories with Recharts</p>
        </div>

        <button
          onClick={() => setShowManualModal(true)}
          className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Quick Log Session</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Sessions</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalWorkouts}</div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> High adherence streak
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Est. Calories Burned</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-400">{totalCalories.toLocaleString()} <span className="text-xs font-normal text-slate-400">kcal</span></div>
          <p className="text-[11px] text-slate-400 mt-1">Across all logged workouts</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Session Time</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-teal-400">{avgDuration} <span className="text-xs font-normal text-slate-400">mins</span></div>
          <p className="text-[11px] text-slate-400 mt-1">Optimal recovery window</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Current Weight & BMI</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{latestWeight} <span className="text-xs font-normal text-slate-400">kg</span></div>
          <p className="text-[11px] text-slate-300 mt-1">BMI: <strong className="text-white">{latestBmi}</strong> (Healthy baseline)</p>
        </div>
      </div>

      {/* Main Recharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calories & Duration Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Calorie Burn & Duration per Session</h3>
              <p className="text-xs text-slate-400">Comparing energy output and session volume</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="shortDate" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="calories" name="Calories Burned (kcal)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="duration" name="Duration (Mins)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intensity Breakdown Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Intensity Distribution</h3>
            <p className="text-xs text-slate-400">RPE effort distribution across routines</p>
          </div>
          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-400">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span>{item.name}: <strong className="text-white">{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weight & BMI Trend Line Chart */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Body Mass & BMI Progression</h3>
            <p className="text-xs text-slate-400">Continuous body recomposition curve</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="shortDate" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="weight" name="Bodyweight (kg)" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="bmi" name="BMI" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={{ fill: '#10b981', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Workout History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          Workout History Log
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Routine Name</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Calories</th>
                <th className="px-4 py-3">Intensity</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {progressLogs.slice().reverse().map((log, idx) => (
                <tr key={log._id || idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 font-mono">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-white">{log.workoutTitle}</td>
                  <td className="px-4 py-3.5">{log.durationMinutes} mins</td>
                  <td className="px-4 py-3.5 text-emerald-400 font-bold">{log.caloriesBurned} kcal</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                      {log.intensity || 'Moderate'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 max-w-xs truncate">{log.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Log Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Log Workout Session</h3>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Workout Title</label>
                <input
                  type="text"
                  value={manualForm.workoutTitle}
                  onChange={(e) => setManualForm({ ...manualForm, workoutTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={manualForm.durationMinutes}
                    onChange={(e) => setManualForm({ ...manualForm, durationMinutes: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={manualForm.caloriesBurned}
                    onChange={(e) => setManualForm({ ...manualForm, caloriesBurned: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={manualForm.weightKg}
                    onChange={(e) => setManualForm({ ...manualForm, weightKg: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Intensity</label>
                  <select
                    value={manualForm.intensity}
                    onChange={(e) => setManualForm({ ...manualForm, intensity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Notes / Reflection</label>
                <input
                  type="text"
                  value={manualForm.notes}
                  onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLogging}
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  {isLogging ? 'Saving...' : 'Save Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
