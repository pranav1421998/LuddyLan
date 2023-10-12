import React from "react";
import './FriendRequests.css';
import GridCards from "./GridCards";
import SidebarFriends from "./SidebarFriends";
const FriendRequests = () => {
    return (
        <div className="component">
            <SidebarFriends></SidebarFriends>
            <h2>Friend Requests</h2>
            <div>
            <GridCards name={"userName"} profilePicture={"Images/user.jpg"} /> {/* Use the GridCards component */}
            </div>
        </div>
    );
};

export default FriendRequests;
