
import './FriendRequests.css';
import GridCards from "./GridCards";
import SidebarFriends from "./SidebarFriends";
import React, { useState, useEffect } from "react";
import { auth, db, storage } from "./firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useUser } from './UserContext';

const RecommendedUsers = () => {
    const [userDetails, setUserDetails] = useState([]);
    const user = useUser();

    // Define fetchFriendsOfFriends outside of useEffect
    const fetchFriendsOfFriends = async (myEmail) => {
        const myFriendsRef = collection(db, "users", myEmail, "Friends");
        let friendsOfFriends = [];

        try {
            // Fetch my friends
            const myFriendsSnap = await getDocs(myFriendsRef);
            const myFriends = myFriendsSnap.docs.map(doc => doc.id);

            // For each of my friends, fetch their friends
            for (const friendEmail of myFriends) {
                const friendsFriendsRef = collection(db, "users", friendEmail, "Friends");
                const friendsFriendsSnap = await getDocs(friendsFriendsRef);
                const friendsFriends = friendsFriendsSnap.docs.map(doc => doc.id);
                friendsOfFriends.push(...friendsFriends);
            }

            // Remove duplicates
            friendsOfFriends = [...new Set(friendsOfFriends)];
            // Remove your email and your friends' emails from the array
            friendsOfFriends = friendsOfFriends.filter(email => email !== myEmail && !myFriends.includes(email));

            return friendsOfFriends;
        } catch (error) {
            console.error("Error fetching friends of friends:", error);
            return [];
        }
    };

    // Fetch friends of friends and their details
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (user && user.email) {
                try {
                    // Await the resolution of fetchFriendsOfFriends
                    const friendsOfFriendsEmails = await fetchFriendsOfFriends(user.email);
                    // console.log(friendsOfFriendsEmails);
    
                    const userDetailsPromises = friendsOfFriendsEmails.map(async (email) => {
                        const userDocRef = doc(db, 'users', email);
                        const userDocSnap = await getDoc(userDocRef);
                        return { ...userDocSnap.data(), id: email }; // Assuming the email is the ID
                    });
    
                    // Await the resolution of all userDetailsPromises
                    const userDetailsData = await Promise.all(userDetailsPromises);
                    setUserDetails(userDetailsData);
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            }
        };
    
        fetchUserDetails();
    }, [user]);
    

    // Update the data array with user details
    const data = userDetails.map(user => ({
        name: user.firstName + ' ' + user.lastName,
        profilePicture: user.profilePicture,
        condition: "RecommendedUsers",
        email: user.id,
    }));
    // console.log(data);
    // console.log(userDetails);
    // console.log(fetchFriendsOfFriends(user.email));
    return (
        <div>
            <SidebarFriends></SidebarFriends>
            <div className='modal-container'>
                <div className="component">
                    <div className='title'>
                        <h2>Recommended Users</h2>
                    </div>
                <div>
                    <GridCards data={data} />
                </div>
            </div>
            </div>
        </div>
    );
};

export default RecommendedUsers;
