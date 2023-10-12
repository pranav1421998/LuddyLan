import React from "react";
import './FriendRequests.css';
import GridCards from "./GridCards";
import SidebarFriends from "./SidebarFriends";
const AllUsers = () => {
    return (
        <div className="component">
        <SidebarFriends></SidebarFriends>
        <h1>All Users</h1>

        <div>
        <GridCards name={"vvvvvvvvvvvv"} profilePicture={"Images/user.jpg"} /> {/* Use the GridCards component */}
        </div>
    </div>
    );
};

export default AllUsers;
