import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import WorkoutGenerator from './components/WorkoutGenerator.jsx';
import WorkoutDisplay from './components/WorkoutDisplay.jsx';
import ProgressDashboard from './components/ProgressDashboard.jsx';
import AICoachChat from './components/AICoachChat.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('generator');
  const [activePlan, setActivePlan] = useState(null);
  const [progressLogs, setProgressLogs] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    database: 'Checking...',
    geminiApiConfigured: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  // Fetch initial health and existing workouts/progress
  useEffect(() => {
    const fetchStatusAndData = async () => {
      try {
        const healthRes = await fetch('/api/health');
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setSystemStatus(healthData);
        }
      } catch (err) {
        console.warn('Backend health check error:', err);
      }

      try {
        const [workoutsRes, progressRes] = await Promise.all([
          fetch('/api/workouts'),
          fetch('/api/progress')
        ]);

        if (workoutsRes.ok) {
          const wData = await workoutsRes.json();
          if (wData.data && wData.data.length > 0) {
            setActivePlan(wData.data[0]);
          }
        }

        if (progressRes.ok) {
          const pData = await progressRes.json();
          if (pData.data) {
            setProgressLogs(pData.data);
          }
        }
      } catch (err) {
        console.warn('Initial data fetch warning:', err);
      }
    };

    fetchStatusAndData();
  }, []);

  // Generate Workout via Gemini API
  const handleGeneratePlan = async (formData) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/recommendations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (result.success && result.data) {
        setActivePlan(result.data);
        setActiveTab('routine');
      } else {
        alert(result.message || 'Failed to generate plan');
      }
    } catch (err) {
      console.error('Plan generation error:', err);
      alert('Error connecting to backend server. Make sure backend is running on port 5000.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Log completed workout to MongoDB & update Recharts dashboard
  const handleLogWorkout = async (logData) => {
    setIsLogging(true);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
      });

      const result = await res.json();
      if (result.success && result.data) {
        setProgressLogs((prev) => [...prev, result.data]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Workout log error:', err);
      return false;
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
      />

      <main className="flex-1">
        {activeTab === 'generator' && (
          <WorkoutGenerator
            onGeneratePlan={handleGeneratePlan}
            isGenerating={isGenerating}
          />
        )}

        {activeTab === 'routine' && (
          <WorkoutDisplay
            plan={activePlan}
            onLogWorkout={handleLogWorkout}
            isLogging={isLogging}
          />
        )}

        {activeTab === 'analytics' && (
          <ProgressDashboard
            progressLogs={progressLogs}
            onLogWorkout={handleLogWorkout}
            isLogging={isLogging}
          />
        )}

        {activeTab === 'coach' && (
          <AICoachChat activePlan={activePlan} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 FitGenius AI — Smart Fitness Recommendation System (MERN + Google Gemini)</p>
          <div className="flex items-center space-x-4">
            <span className="text-emerald-400 font-semibold">React.js</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Node / Express</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">MongoDB</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Gemini API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
