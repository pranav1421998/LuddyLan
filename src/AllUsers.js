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
                        userDataArray.push({id:doc.id, ...doc.data()});
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

    const userIdToUserData = {};
    userIds.forEach((userId, index) => {
    userIdToUserData[userId] = userdata[index];
    });

    const data = userIds.map(userId => {
        const user = userIdToUserData[userId];
        const friendData = friendsData.find(friend => friend.follower_email === userId);
        let isConnected = ""; // Declare as a variable

        if (friendData && friendData.is_accepted) {
            isConnected = 'following';
        } else if (friendData && !friendData.is_accepted) {
            isConnected = 'requested';
        } else {
            isConnected = '';
        }
        return {
          name: user.firstName + ' ' + user.lastName,
          email: userId,
          profilePicture: user.profilePicture,
          condition: "AllUsers",
          connected: isConnected,
        };
      });
      
      

    return (
        <div>
            <SidebarFriends></SidebarFriends>
            <div className="component">
                <div className='title'><h2 className='heading'>All Users</h2></div>
                <div>
                    <GridCards data={data} />
                </div>

            </div>
        </div>
    );
};

export default AllUsers;
