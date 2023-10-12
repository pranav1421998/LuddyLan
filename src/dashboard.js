import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import './dashboard.css';
//import Sidebar from './Sidebar';
import { Link } from "react-router-dom";
import { db, auth } from "./firebaseConfig";


const Dashboard = () => {
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, "users", user.email);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserDetails({ id: userDoc.id, ...userDoc.data() }); // Include the document ID in the user data
                    // Update a single field in the document
                    try {
                        await updateDoc(userDocRef, {
                            loggedIn: true
                        });
                        window.status = true;
                        console.log("Document successfully updated!");
                        } catch (error) {
                        console.error("Error updating document: ", error);
                        }
                } else {
                    console.log("No such document!");
                }
            } else {
                console.log("No user is signed in");
            }
        });
    }, [auth, db]);

    return (
        <div className="container">
            {/* <Sidebar /> */}
            <img src={process.env.PUBLIC_URL + './icon2.png'} alt="App Logo" className="logo" />
            <h1>User Dashboard</h1>
            {userDetails ? (
                <div className="user-details">
                    <p>Email: {userDetails.id}</p>
                    <p>First Name: {userDetails.firstName}</p>
                    <p>Last Name: {userDetails.lastName}</p>
                    <p>Birth Year: {userDetails.birthYear}</p>
                    <p>Phone: {userDetails.phone}</p>
                </div> ) : ( <p className="loading">Loading user details...</p>)}
                

        </div>
    );
};

export default Dashboard;
