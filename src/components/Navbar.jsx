import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <h1>AI Lead Generation Dashboard</h1>
      <div className="nav-links">
        <Link to="/" className={isActive('/')}>Dashboard</Link>
        <Link to="/campaigns" className={isActive('/campaigns')}>Campaigns</Link>
        <Link to="/company-leads" className={isActive('/company-leads')}>Company Leads</Link>
        <Link to="/decision-makers" className={isActive('/decision-makers')}>Decision Makers</Link>
        <Link to="/outreach-status" className={isActive('/outreach-status')}>Outreach Status</Link>
      </div>
    </nav>
  );
};

export default Navbar;
