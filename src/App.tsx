import { useState } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Subscribe from './components/Subscribe';
import Login from './components/Login';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'subscribe' | 'login'>('landing');
  const [selectedPlan, setSelectedPlan] = useState<string>('starter');

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    setCurrentView('subscribe');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
      {currentView === 'landing' && (
        <Landing 
          onEnter={() => setCurrentView('dashboard')} 
          onSubscribe={handleSubscribe} 
          onLogin={() => setCurrentView('login')}
        />
      )}
      {currentView === 'login' && (
        <Login 
          onBack={() => setCurrentView('landing')} 
          onLogin={() => setCurrentView('dashboard')} 
        />
      )}
      {currentView === 'subscribe' && (
        <Subscribe 
          planId={selectedPlan} 
          onBack={() => setCurrentView('landing')} 
          onConfirm={() => setCurrentView('dashboard')} 
        />
      )}
      {currentView === 'dashboard' && (
        <Dashboard onSignOut={() => setCurrentView('landing')} />
      )}
    </div>
  );
}
