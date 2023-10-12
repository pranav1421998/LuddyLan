import './FriendRequests.css';
import GridCards from "./GridCards";
import SidebarFriends from "./SidebarFriends";
import React, { useState, useEffect } from "react";
import {auth, db, provider, storage} from "./firebaseConfig";
import { collection, addDoc, doc, setDoc, getDocs } from 'firebase/firestore';


const AllUsers = () => {
    const [userdata, setDocuments] = useState([]); 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userCollRef = collection(db, 'users');
                const userSnapshot = await getDocs(userCollRef);
                const userDataArray = userSnapshot.docs.map(doc => doc.data());
                setDocuments(userDataArray);
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
    
        fetchData();
    }, []);

console.log(userdata);


    const data = [ 
        //{ name: userdata[0].firstName  , profilePicture: "Images/user.jpg/" }
    ];
    for (let i=0; i<userdata.length; i++) {
        data.push({name: userdata[i].firstName, profilePicture: "Images/user.jpg"})

    }

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
