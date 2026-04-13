import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import CompanyLeads from './pages/CompanyLeads';
import DecisionMakers from './pages/DecisionMakers';
import OutreachStatus from './pages/OutreachStatus';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/company-leads" element={<CompanyLeads />} />
            <Route path="/decision-makers" element={<DecisionMakers />} />
            <Route path="/outreach-status" element={<OutreachStatus />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
