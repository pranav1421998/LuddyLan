import './Sidebar.css';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar2 = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('Posts');
    
    useEffect(() => {
        const currentPath = location.pathname;
        const pathTabMap = {
            '/dashboard': 'Posts',
            '/PollList': 'Polls',
            '/Groups': 'Groups'
        };
        const initialTab = pathTabMap[currentPath] || 'Posts'; // Use 'Posts' as the default if no match
        setActiveTab(initialTab);
        console.log(initialTab);
        handleTabClick(initialTab); // Call handleTabClick with the calculated initial tab
    }, [location.pathname]);
    

    
    const handleTabClick = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    return (
        <div className="sidebar">
            <div className="tabs">
                <div className={`tab ${activeTab === 'Posts' ? 'active' : ''}`} onClick={() => handleTabClick('Posts')}>
                    <Link to="/dashboard">Posts</Link>
                </div>
                <div className={`tab ${activeTab === 'Polls' ? 'active' : ''}`} onClick={() => handleTabClick('Polls')}>
                    <Link to="/PollList">Polls</Link>
                </div>
                <div className={`tab ${activeTab === 'Groups' ? 'active' : ''}`} onClick={() => handleTabClick('Polls')}>
                    <Link to="/Groups">Groups</Link>
                </div>
            </div>
        </div>
    );
};

export default Sidebar2;