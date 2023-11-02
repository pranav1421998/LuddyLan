import './Sidebar.css';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar2 = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('Posts');

    useEffect(() => {
        const currentPath = location.pathname; // Get current path
        const pathTabMap = { // Map paths to tab names
            '/dashboard': 'Posts',
            '/PollList': 'Polls'
        };
        setActiveTab(pathTabMap[currentPath] || ''); // Set active tab based on current path
    }, [location.pathname]); // Dependence on pathname ensures effect runs on route change
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="sidebar">
            <div className="tabs">
                <div className={`tab ${activeTab === 'Posts' ? 'active' : ''}`} onClick={() => handleTabClick('Posts')}>
                    <Link to="/dashboard">Posts</Link> {/* Link to the Settings page */}
                </div>
                <div className={`tab ${activeTab === 'Polls' ? 'active' : ''}`} onClick={() => handleTabClick('Polls')}>
                    <Link to="/PollList">Polls</Link> {/* Link to the Dashboard page */}
                </div>
            </div>
        </div>
    );
};

export default Sidebar2;