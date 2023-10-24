import './dashboard.css';
import CreatePost from './CreatePost';
import PollPopup from './CreatePoll';
import { db, auth } from "./firebaseConfig";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc, getDocs, updateDoc, orderBy, query, collection, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [posts, setPosts] = useState([]);

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

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

    const getFriendProfilePicture = async (friendEmail) => {
        try {
            const friendUserDocRef = doc(db, "users", friendEmail);
            const friendUserDoc = await getDoc(friendUserDocRef);
            if (friendUserDoc.exists()) {
                const friendUserData = friendUserDoc.data();
                return friendUserData.profilePicture || null; 
            } else {
                console.error("No such document for friend user:", friendEmail);
                return null; 
            }
        } catch (error) {
            console.error("Error fetching friend's profile picture:", error);
            return null; 
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, "users", user.email);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserDetails({ id: userDoc.id, ...userDoc.data() });
                    const userEmailAddress = user.email;
                    const fetchFriends = async () => {
                        const friendsRef = collection(db, "friends");
                        const q = query(friendsRef, where("user_email", "==", userEmailAddress), where("is_accepted", "==", true));
                        const querySnapshot = await getDocs(q);
                        const friendsArray = [];
                        querySnapshot.forEach((doc) => {
                            friendsArray.push({ id: doc.id, ...doc.data() });
                        });
                        const friendEmails = friendsArray.map((friend) => friend.follower_email);
                        const postQuery = query(collection(db, "posts"), where("ownerId", "in", friendEmails), orderBy("uploadedDate", "desc"));
                        const postQuerySnapshot = await getDocs(postQuery);
                        const postArray = [];
                        postQuerySnapshot.forEach(async (doc) => {
                            const postData = { id: doc.id, ...doc.data() };
                            postData.friendProfilePicture = await getFriendProfilePicture(postData.ownerId);
                            postArray.push(postData);
                        });
                        setPosts(postArray);
                    };
                    fetchFriends();
                } else {
                    console.log("No such document!");
                }
            } else {
                console.log("No user is signed in");
            }
        };
        const unsubscribe = onAuthStateChanged(auth, fetchData);     
        return () => unsubscribe();
    }, [auth, db]);

    // Function to format a date as a more readable string
    const formatTimestamp = (timestamp) => {
        const date = timestamp.toDate();
        const options = { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleString(undefined, options);
    };

    return (
        <section className="main">
            <div className="post-container">
                <div className="top-btn">
                    <button className="modal-btn" onClick={handleOpenModal}>Create Post</button>
                    <button className="modal-btn" onClick={openPollPopup}>Create Poll</button>
                    <Link to="/pollList">Poll</Link>
                </div>
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

                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <div className="post">
                                <div className="post-header">
                                    <p className="user-icon">
                                        {post.friendProfilePicture ? (
                                            <img
                                                src={post.friendProfilePicture}
                                                alt="Profile"
                                                className="profile-picture"
                                            />
                                        ) : (
                                            <FontAwesomeIcon icon={faUser} />
                                        )}
                                    </p>
                                    <div className="head">
                                        <p className="username">{post.ownerId}</p>
                                        <p className="date">{formatTimestamp(post.uploadedDate)}</p>
                                    </div>
                                </div>
                                <div className="post-detail">
                                    <p style={{ color: 'black' }}>{post.caption}</p>
                                </div>
                                <div className="post-feed">
                                    <img src={post.media} className="image-container" alt="Image" />
                                </div>
                                <div className="detail-interactions">
                                    <button className="interact-btn"><FontAwesomeIcon icon={faThumbsUp} /> Like</button>|
                                    <button className="interact-btn"><FontAwesomeIcon icon={faComment} /> Comment</button>|
                                    <button className="interact-btn"><FontAwesomeIcon icon={faShare} /> Share</button>
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
