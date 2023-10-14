import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import './dashboard.css';
import Sidebar from './Sidebar';
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "./firebaseConfig";
import CreatePost from './CreatePost';
import PollPopup from './CreatePoll';


const Dashboard = () => {
    const [userDetails, setUserDetails] = useState(null);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const openPollPopup = () => {
        setShowPopup(true);
    };
    const ClosePollPopup=()=>{
      setShowPopup(false);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
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
            <Sidebar />
            <img src={process.env.PUBLIC_URL + './icon2.png'} alt="App Logo" className="logo" />
            <h1>User Dashboard</h1>
            {userDetails ? (
                <div className="user-details">
                    <p>Email: {userDetails.id}</p>
                    <p>First Name: {userDetails.firstName}</p>
                    <p>Last Name: {userDetails.lastName}</p>
                    <p>Birth Year: {userDetails.birthYear}</p>
                    <p>Phone: {userDetails.phone}</p>
                    <button type="button" onClick={handleOpenModal}>Create Post</button>
                    <button onClick={openPollPopup}>Create Poll</button>
                </div>
            ) : (
                <p className="loading">Loading user details...</p>
            )}

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>close</span>
                        <CreatePost onClose={handleCloseModal} />
                    </div>
                </div>
            )}
              {showPopup && (
                <div className="modal">
                    <div className="modal-content">
                        <PollPopup onClose={ClosePollPopup} onPollCreated={ClosePollPopup} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
