import React, { useState, useEffect } from 'react';
import './SidebarFriends.css';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';

const SidebarFriends = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('/friendRequests');

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  return (
    <div className="sidebar-container">
      <Sidebar style={{ background: '#9b0303' }}> {/* Set the background color here */}
        <Menu style={{ background: '#9b0303', color: 'white' }}>
          <Link to="/friendRequests">
            <MenuItem
              style={{
                textDecoration: 'none',
                background: activeTab === '/friendRequests' ? 'white' : 'transparent',
                color: activeTab === '/friendRequests' ? '#9b0303' : 'white'
              }}
            >
              Friend Requests
            </MenuItem>
          </Link>
          <Link to="/myFriends">
            <MenuItem
              style={{
                textDecoration: 'none',
                background: activeTab === '/myFriends' ? 'white' : 'transparent',
                color: activeTab === '/myFriends' ? '#9b0303' : 'white'
              }}
            >
              My Friends
            </MenuItem>
          </Link>
          <Link to="/allUsers">
            <MenuItem
              style={{
                background: activeTab === '/allUsers' ? 'white' : 'transparent',
                color: activeTab === '/allUsers' ? '#9b0303' : 'white'
              }}
            >
              All Users
            </MenuItem>
          </Link>
          <Link to="/recommendedUsers">
            <MenuItem
              style={{
                background: activeTab === '/recommendedUsers' ? 'white' : 'transparent',
                color: activeTab === '/recommendedUsers' ? '#9b0303' : 'white'
              }}
            >
              Recommended Users
            </MenuItem>
          </Link>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarFriends;
