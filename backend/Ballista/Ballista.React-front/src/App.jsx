import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Features from './components/Features';
import TechnologySection from './components/TechnologySection';
import TelegramSection from './components/TelegramSection';
import BetaSection from './components/BetaSection';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <Features />
      <TechnologySection />
      <TelegramSection />
      <BetaSection />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;