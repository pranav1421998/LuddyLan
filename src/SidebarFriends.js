import React, { useState } from 'react';
import './SidebarFriends.css';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';

const SidebarFriends = () => {
  const location = useLocation(); // Get the current location
  const [activeTab, setActiveTab] = useState(location.pathname);

  return (
    <div className="sidebar-container">
      <Sidebar className="sidebar">
        <Menu style={{ background: '#9b0303', color: 'white' }}>
          <Link to="/friendRequests">
            <MenuItem active={activeTab === './friendRequests'}>Friend Requests</MenuItem>
          </Link>
          <Link to="/friendRequests">
            <MenuItem active={activeTab === './friendRequests'}>My Friends</MenuItem>
          </Link>
          <Link to="/allUsers">
            <MenuItem active={activeTab === './allUsers'}>All Users</MenuItem>
          </Link>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarFriends;
