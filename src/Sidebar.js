// Sidebar.js
import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { Link, useLocation} from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  useEffect(() => {
    const currentPath = location.pathname; // Get current path
    const pathTabMap = { // Map paths to tab names
      '/profile': 'profile',
      '/profileSettings': 'settings',
      '/dashboard': 'dashboard',
    };
    setActiveTab(pathTabMap[currentPath] || ''); // Set active tab based on current path
  }, [location.pathname]); // Dependence on pathname ensures effect runs on route change

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="sidebar">
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabClick('profile')}
        >
          <Link to="/profile">Profile</Link> {/* Link to the Profile page */}
        </div>
        <div
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => handleTabClick('settings')}
        >
          <Link to="/profileSettings">Settings</Link> {/* Link to the Settings page */}
        </div>
        <div
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleTabClick('dashboard')}
        >
          <Link to="/dashboard">Dashboard</Link> {/* Link to the Dashboard page */}
        </div>
      </div>
      {/* Sidebar content for each tab */}
      {/* You can add more content for each tab as needed */}
    </div>
  );
};

export default Sidebar;
