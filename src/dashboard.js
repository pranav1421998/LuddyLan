import React, { useEffect, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './dashboard.css';
 

const Dashboard = () => {
    const [userDetails, setUserDetails] = useState(null);
    const db = getFirestore();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, "users", user.email);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserDetails({ id: userDoc.id, ...userDoc.data() }); // Include the document ID in the user data
                } else {
                    console.log("No such document!");
                }
            } else {
                console.log("No user is signed in");
            }
        });
    
        return () => unsubscribe(); // Unsubscribe from the observer on component unmount
    }, [auth, db]);

    return (
        <div className="container">
            <h1>User Dashboard</h1>
            {userDetails ? (
                <div className="user-details">
                    <img src={process.env.PUBLIC_URL + './icon2.png'} alt="App Logo" className="logo" />
                    <p>Email: {userDetails.id}</p>
                    <p>First Name: {userDetails.firstName}</p>
                    <p>Last Name: {userDetails.lastName}</p>
                    <p>Birth Year: {userDetails.birthYear}</p>
                    <p>Phone: {userDetails.phone}</p>
                </div>
            ) : (
                <p className="loading">Loading user details...</p>
            )}
        </div>
    );
};

export default Dashboard;
