import './FriendRequests.css';
import GridCards from "./GridCards";
import SidebarFriends from "./SidebarFriends";
import React, { useState, useEffect } from "react";
import { db} from "./firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useUser } from './UserContext';

const FriendRequests = () => {

    const [userRequests, setUserRequests] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const user = useUser();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const userDocRef = doc(db, 'users', user.email);
                const requestsCollectionRef = collection(userDocRef, 'Requests');
                const requestQuery = query(requestsCollectionRef);
                const requestSnapshot = await getDocs(requestQuery);
                const requestDocumentIds = requestSnapshot.docs.map(doc => doc.id);
                setUserRequests(requestDocumentIds);
            } catch (error) {
                console.error("An error occurred while fetching request document IDs:", error);
            }
        };

        fetchRequests();
    }, [user]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userDetailsPromises = userRequests.map(async (documentId) => {
                    const userDocRef = doc(db, 'users', documentId); // Assuming documentId is the user's ID
                    const userDocSnapshot = await getDoc(userDocRef);
                    const userData = userDocSnapshot.data();
                    userData.id = documentId;
                    return userData;
                });

                const userDetailsData = await Promise.all(userDetailsPromises);

                setUserDetails(userDetailsData);
            } catch (error) {
                console.error("An error occurred while fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, [userRequests]);


    
    const data = userDetails.map(user => ({
        name: user.firstName + ' ' + user.lastName, // Adjust this based on the field name in your "users" collection
        profilePicture: user.profilePicture, // Adjust this based on the field name in your "users" collection
        condition: "FriendRequests",
        email: user.id,
    }));

    return (
        <div>
            <SidebarFriends></SidebarFriends>
            <div className='modal-container'>
                <div className="component">
                    <div className='title'>
                        <h2>Friend Requests</h2>
                    </div>
                <div>
                    <GridCards data={data} />
                </div>
            </div>
            </div>
        </div>
    );
};

export default FriendRequests;
