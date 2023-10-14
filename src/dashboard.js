import './dashboard.css';
import React, { useEffect, useState } from "react";
import { doc, getDoc, getDocs, updateDoc, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import { db, auth } from "./firebaseConfig";
import Sidebar from './Sidebar';
import { Link, useNavigate } from "react-router-dom";
import CreatePost from './CreatePost';
import PollPopup from './CreatePoll';

const Dashboard = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [posts, setPosts] = useState([]);

    const navigate = useNavigate();

    const openPollPopup = () => {
        setShowPopup(true);
    };

    const ClosePollPopup = () => {
        setShowPopup(false);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            const collectionRef = collection(db, 'posts');
            const querySnapshot = await getDocs(collectionRef);
            const documentsData = [];
            querySnapshot.forEach((doc) => {
                documentsData.push({ id: doc.id, ...doc.data() });
            });
            setPosts(documentsData);
        };
        fetchPosts();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, "users", user.email);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserDetails({ id: userDoc.id, ...userDoc.data() });
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

        return () => unsubscribe(); // Unsubscribe from the observer on component unmount
    }, [auth, db]);

    return (
        <section className="main">
            <div className="post-container">
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <div className="post">
                                <div className="post-header">
                                    <p className="user-icon"><FontAwesomeIcon icon={faUser} /></p>
                                    <p className="username">{post.ownerId}</p>
                                </div>
                                <div className="post-detail">
                                    <p className="no-top-margin">{post.caption}</p>
                                </div>
                                <div className="post-feed">
                                    <img src={post.media} className="image-container" alt="Image" />
                                </div>
                                <div className="detail-interactions">
                                    <button className="btn"><FontAwesomeIcon icon={faThumbsUp} /> Like</button>
                                    <button className="btn"><FontAwesomeIcon icon={faComment} /> Comment</button>
                                    <button className="btn"><FontAwesomeIcon icon={faShare} /> Share</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Dashboard;
