import './FriendRequests.css';
import GridCards from "./GridCards";
import SidebarFriends from "./SidebarFriends";
import React, { useState, useEffect } from "react";
import { auth, db, storage } from "./firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
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
                const userIdArray = [];
                const userDataArray = [];

                userSnapshot.docs.forEach(doc => {
                    if (doc.id !== user.email) { 
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
    const [friendDocumentIds, setFriendDocumentIds] = useState([]);

    useEffect(() => {
        const fetchFriendsData = async () => {
            try {
                const userDocRef = doc(db, 'users', user.email);
                const friendsCollectionRef = collection(userDocRef, 'Friends');
                const friendsQuery = query(friendsCollectionRef);
                const friendsSnapshot = await getDocs(friendsQuery);
                const friendDocumentIds = friendsSnapshot.docs.map(doc => doc.id);
                setFriendDocumentIds(friendDocumentIds);
            } catch (error) {
                console.error("An error occurred while fetching friend document IDs:", error);
            }
        };
        fetchFriendsData();
    }, [user]);
    
    const [requestDocumentIds, setRequestDocumentIds] = useState([]);

    useEffect(() => {
        const fetchRequestsData = async () => {
            try {
                const userDocRef = doc(db, 'users', user.email);
                const requestsCollectionRef = collection(userDocRef, 'Requests');
                const requestsQuery = query(requestsCollectionRef);
                const requestsSnapshot = await getDocs(requestsQuery);
                const requestDocumentIds = requestsSnapshot.docs.map(doc => doc.id);
                setRequestDocumentIds(requestDocumentIds);
            } catch (error) {
                console.error("An error occurred while fetching friend document IDs:", error);
            }
        };
        fetchRequestsData();
    }, [user]);

    const [yourRequestDocumentIds, setYourRequestDocumentIds] = useState([]);
    useEffect(() => {
        const fetchYourRequestsData = async () => {
          try {
            const yourRequestDocumentIds = [];
            const usersCollectionRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollectionRef);
            for (const userDoc of usersSnapshot.docs) {
              const userDocRef = userDoc.ref;
              const requestDocRef = doc(userDocRef, 'Requests', user.email);
              const requestDocSnapshot = await getDoc(requestDocRef);
              if (requestDocSnapshot.exists()) {
                yourRequestDocumentIds.push(userDoc.id);
              }
            }
            setYourRequestDocumentIds(yourRequestDocumentIds);
          } catch (error) {
            console.error("An error occurred while fetching friend document IDs:", error);
          }
        };
    
        // Execute the fetchYourRequestsData function
        fetchYourRequestsData();
      }, [user]);

    const data = userdata.map(user => {
        let isConnected = "Connect";
        if (friendDocumentIds.includes(user.id)) {
          isConnected = "Following";
        }
        if (requestDocumentIds.includes(user.id) || yourRequestDocumentIds.includes(user.id)) {
            isConnected = "Requested";
        }
        return {
          name: user.firstName + ' ' + user.lastName,
          email: user.id,
          profilePicture: user.profilePicture,
          condition: "AllUsers",
          connected: isConnected,
        };
      });
      
    return (
        <div>
            <SidebarFriends></SidebarFriends>
            <div className='modal-container'>
                <div className="component">
                    <div className='title'>
                        <h2>All Users</h2>
                    </div>
                <div>
                    <GridCards data={data} />
                </div>
            </div>
            </div>
        </div>
    );
};

export default AllUsers;
