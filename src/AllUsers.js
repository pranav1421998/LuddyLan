import './FriendRequests.css';
import GridCards from "./GridCards";
import SidebarFriends from "./SidebarFriends";
import React, { useState, useEffect } from "react";
import { auth, db, storage } from "./firebaseConfig";
import { collection, getDocs } from 'firebase/firestore';
import { useUser } from './UserContext';

const AllUsers = () => {
    const [userdata, setDocuments] = useState([]);
    const user = useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRef = collection(db, 'users');
                const userSnapshot = await getDocs(usersRef);

                // Filter out the currently logged-in user
                const userDataArray = userSnapshot.docs
                    .filter(doc => doc.id !== user.email) // Assuming user.email is the document ID
                    .map(doc => doc.data());

                setDocuments(userDataArray);
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };

        fetchData();
    }, [user]);

    const data = userdata.map(user => ({
        name: user.firstName + ' ' + user.lastName,
        profilePicture: "Images/user.jpg",
        condition: "AllUsers",
    }));

    return (
        <div>
            <SidebarFriends></SidebarFriends>
            <div className="component" >
            <h2 className='heading'>All Users</h2>
                <GridCards data={data} />
            </div>
        </div>
    );
};

export default AllUsers;
