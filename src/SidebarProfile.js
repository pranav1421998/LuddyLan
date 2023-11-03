import React, { useState, useEffect } from 'react';
import './SidebarFriends.css';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';

const SidebarProfile = () => {

  const location = useLocation();
  const [activeTab, setActiveTab] = useState('/friendRequests');

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  return (
    <div className="sidebar-container">
      <Sidebar>
        <Menu>
          <Link to="/profile">
            <MenuItem
              style={{
                textDecoration: 'none',
                background: activeTab === '/profile' ? 'white' : 'transparent',
                color: activeTab === '/profile' ? '#9b0303' : 'white'
              }}
            >
              Profile
            </MenuItem>
          </Link>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarProfile;