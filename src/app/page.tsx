"use client"

import React, { useState } from 'react';
import InternalUIComponent from './components/InternalUIComponent';
import LoginComponent from './components/LoginComponent';
import SuccessComponent from './components/SuccessComponent';
import Home from './components/HomeComponent';

interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  linkedinProfile: string;
  country: string;
  visasOfInterest: string[];
  resumeFileName: string;
  additionalInfo: string;
  status: 'PENDING' | 'REACHED_OUT';
  submissionDate: string;
}

const App = () => {
  const [currentView, setCurrentView] = useState<'publicForm' | 'login' | 'internalUI' | 'submissionSuccess'>('publicForm');


  const handleLogout = () => {
    setCurrentView('login');
  };

  return (
    <div>
      {currentView === 'publicForm' && <Home onSuccessfulSubmission={() => setCurrentView('submissionSuccess')} />}
      {currentView === 'submissionSuccess' && <SuccessComponent setCurrentView={setCurrentView} />}
      {currentView === 'login' && <LoginComponent onLoginSuccess={() => setCurrentView('internalUI')} />}
      {currentView === 'internalUI' && <InternalUIComponent onLogout={handleLogout} />}
    </div>
  );
};

export default App;