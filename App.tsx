import React, { useState, useEffect } from 'react';
import { User } from './types';
import { authService } from './services/authService';
import { AuthView } from './components/AuthView';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check for existing session
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsInitializing(false);
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (isInitializing) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  if (!user) {
    return <AuthView onLogin={handleLogin} />;
  }

  // Use key={user.username} to force re-render Dashboard when user changes
  // This ensures state (like inventory) is completely reset/reloaded
  return <Dashboard key={user.username} user={user} onLogout={handleLogout} />;
};

export default App;
