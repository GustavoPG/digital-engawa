import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Lessons } from './pages/Lessons';
import { Practice } from './pages/Practice';
import { Dictionary } from './pages/Dictionary';
import { Progress } from './pages/Progress';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'lessons':
        return <Lessons />;
      case 'practice':
        return <Practice />;
      case 'dictionary':
        return <Dictionary />;
      case 'progress':
        return <Progress />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="flex-1 overflow-y-auto px-16 py-12">
        <Header />
        {renderPage()}
      </main>
    </div>
  );
}
