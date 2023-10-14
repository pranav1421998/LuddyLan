import './FriendRequests.css';
import GridCards from "./GridCards";
import SidebarFriends from "./SidebarFriends";
import React, { useState, useEffect } from "react";
import { auth, db, storage } from "./firebaseConfig";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useUser } from './UserContext';

const AllUsers = () => {
    const [userIds, setUserIds] = useState([]); // State to store document IDs
    const [userdata, setDocuments] = useState([]); // State to store user data
    const user = useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRef = collection(db, 'users');
                const userSnapshot = await getDocs(usersRef);

                // Create an array to store the document IDs using a separate loop
                const userIdArray = [];
                const userDataArray = [];

                userSnapshot.docs.forEach(doc => {
                    if (doc.id !== user.email) { // Exclude the currently logged-in user
                        userIdArray.push(doc.id);
                        userDataArray.push(doc.data());
                    }
                });

                setUserIds(userIdArray);
                setDocuments(userDataArray);
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };

        fetchData();
    }, [user]);

    const [friendsData, setFriendsData] = useState([]);

    useEffect(() => {
        const fetchFriendsData = async () => {
            try {
                // Fetch friends data based on the criteria
                const friendsRef = collection(db, 'friends');
                const q = query(friendsRef, where('user_email', '==', user.email), where('follower_email', 'in', userIds));
                const friendsSnapshot = await getDocs(q);
                
                // You now have an array of friends data based on the criteria
                const friendsDataArray = friendsSnapshot.docs.map(doc => doc.data());
                setFriendsData(friendsDataArray);
                // You can process the friendsDataArray as needed
            } catch (error) {
                console.error("An error occurred while fetching friends data:", error);
            }
        };

        // Execute the fetchFriendsData function after userIds are available
        if (userIds.length > 0) {
            fetchFriendsData();
        }
    }, [user, userIds]);

    const data = userdata.map(user => {
        // Check if the user's email is in the friendsData
        const isConnected = friendsData.some(friend => friend.follower_email === user.id);
    
        return {
            name: user.firstName + ' ' + user.lastName,
            profilePicture: "Images/user.jpg",
            condition: "AllUsers",
            connected: isConnected, // Set connected based on the check
        };
    });
    

    return (
        <div>
            <SidebarFriends></SidebarFriends>
            <div className="component">
                <h2 className='heading'>All Users</h2>
                <GridCards data={data} />
            </div>
        </div>
    );
};

export default AllUsers;
