import React, { useEffect, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './dashboard.css';
import {Link ,useNavigate} from "react-router-dom";
import { db, auth } from "./firebaseConfig";

const Dashboard = () => {
    const [userDetails, setUserDetails] = useState(null);
    const navigate=useNavigate();
    const handlePost = async (e) => {
        e.preventDefault();
        try {
            navigate('/CreatePost'); 
        } catch (error) {
            console.error('Error during redirecting:', error);
        }
    };
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
                    <Link to="/profile">Profile Page</Link>
                    <p>Email: {userDetails.id}</p>
                    <p>First Name: {userDetails.firstName}</p>
                    <p>Last Name: {userDetails.lastName}</p>
                    <p>Birth Year: {userDetails.birthYear}</p>
                    <p>Phone: {userDetails.phone}</p>
                    <button type="submit" onClick={handlePost}>Create Post</button>
                </div> ) : ( <p className="loading">Loading user details...</p>)}

        </div>
    );
};

export default Dashboard;
