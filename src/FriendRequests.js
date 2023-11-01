import './FriendRequests.css';
import GridCards from "./GridCards";
import SidebarFriends from "./SidebarFriends";
import React, { useState, useEffect } from "react";
import { db} from "./firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useUser } from './UserContext';

const FriendRequests = () => {
    // const [userdata, setDocuments] = useState([]);
    // const [userData, setUserData] = useState([]); // State to store fetched user details
    // const user = useUser();

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // Assuming you have a "friends" collection
    //             const friendsRef = collection(db, 'friends');
    //             const q = query(friendsRef, where('follower_email', '==', user?.email), where('is_accepted', '==', false));
    //             const friendSnapshot = await getDocs(q);

    //             const friendDataArray = friendSnapshot.docs.map(doc => doc.data());

    //             // You now have an array of all friends where user_email is equal to the logged-in user's email and is_accepted is true
    //             setDocuments(friendDataArray);
    //         } catch (error) {
    //             console.error("An error occurred while fetching friend requests:", error);
    //         }
    //     };

    //     fetchData();
    // }, [user]);

    // useEffect(() => {
    //     const userEmail = userdata.map(ud => ud.follower_email);

    //     const fetchUserDetails = async () => {
    //         try {
    //             // Create an array to store promises for fetching user details
    //             const fetchPromises = userEmail.map(async (email) => {
    //                 const userDocRef = doc(db, 'users', email); // Assuming email is the document ID
    //                 const userSnapshot = await getDoc(userDocRef);

    //                 if (userSnapshot.exists()) {
    //                     // Fetch user details based on the document ID (email)
    //                     const userDetails = userSnapshot.data();
    //                     userDetails.id = userSnapshot.id;
    //                     return userDetails;
    //                 }
    //             });

    //             // Use Promise.all to fetch all user details in parallel
    //             const userDetails = await Promise.all(fetchPromises);

    //             // Filter out any potential null values (failed fetches)
    //             const filteredUserDetails = userDetails.filter(user => user !== null);

    //             // Update the userData state with the fetched user details
    //             setUserData(filteredUserDetails);
    //         } catch (error) {
    //             console.error("An error occurred while fetching user details:", error);
    //         }
    //     };

    //     // Fetch user details for all users in the userEmail list
    //     if (userEmail.length > 0) {
    //         fetchUserDetails();
    //     }
    // }, [userdata]);

    // console.log(userData);

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
