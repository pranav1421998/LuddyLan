import React from "react";
import './FriendRequests.css';
import GridCards from "./GridCards";
import SidebarFriends from "./SidebarFriends";
const AllUsers = () => {
    const data = [
        { name: "User 1", profilePicture: "Images/user.jpg/" },
        { name: "User 2", profilePicture: "Images/user.jpg" },
        { name: "User 3", profilePicture: "Images/user.jpg" },
        { name: "User 3", profilePicture: "Images/user.jpg" },
        { name: "User 3", profilePicture: "Images/user.jpg" },
        { name: "User 3", profilePicture: "Images/user.jpg" },
        { name: "User 3", profilePicture: "Images/user.jpg" },
        { name: "User 3", profilePicture: "Images/user.jpg" },
        { name: "User 3", profilePicture: "Images/user.jpg" },
        { name: "User 3", profilePicture: "Images/user.jpg" },
        { name: "User 3", profilePicture: "Images/user.jpg" },

        // Add more data as needed
    ];

    return (
        <div className="component">
            <SidebarFriends></SidebarFriends>
            <h2>Friend Requests</h2>
            <div>
            <GridCards data={data} />
            </div>
        </div>
    );
};

export default AllUsers;
