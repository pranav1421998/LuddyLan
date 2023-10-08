import React from "react";
import './FriendRequests.css';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import GridCards from "./GridCards"; // Updated import statement

const FriendRequests = () => {
    return (
        <div className="sidebar-container">
            <Sidebar className="sidebar">
                <Menu style={{background: '#9b0303', color: 'white'}}>
                    <MenuItem> Friend Requests </MenuItem>
                    <MenuItem> My Friends </MenuItem>
                    <MenuItem> All Users </MenuItem>
                </Menu>
            </Sidebar>
            <div>
            <GridCards /> {/* Use the GridCards component */}
            </div>
        </div>
    );
};

export default FriendRequests;
