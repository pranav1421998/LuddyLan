import './dashboard.css';
import CreatePost from './CreatePost';
import PollPopup from './CreatePoll'; 
import { db, auth } from "./firebaseConfig";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc, getDocs, updateDoc, orderBy, query, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
//cookies
import Cookies from 'js-cookie';

const Dashboard = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [posts, setPosts] = useState([]);

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    /// fetch user details from cookies
    const user_email = Cookies.get('userDetails');

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

        const fetchPosts = async () => {
            const collectionRef = collection(db, "posts");
            const q = query(collectionRef, orderBy("uploadedDate", "desc")); // Order by "uploadedDate" in descending order (most recent to least recent)
            const querySnapshot = await getDocs(q);
            const postArray = [];
            querySnapshot.forEach((doc) => {
              postArray.push({ id: doc.id, ...doc.data() });
            });
            setPosts(postArray);
        };
        fetchPosts();

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

    // Function to format a date  as a more readable string
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
                {/* post header */}
                <div className="post-header">
                <p className="user-icon"><FontAwesomeIcon icon={faUser}/></p>
                    <div className="head">
                        <p className= "username">{post.ownerId}</p>
                        <p className="date">{formatTimestamp(post.uploadedDate)}</p>
                    </div>
                </div>
                {/* post caption */}
                <div className="post-detail">
                    <p style={{color: 'black'}}>{post.caption}</p>    
                </div>
                {/* post section */}
                <div className="post-feed">
                    <img src={post.media} className="image-container" alt="Image" />
                </div>
                {/* post buttons */}
                <div className="detail-interactions">
                    {/* create functions that take in a post.id to fetch nested collections and update them */}
                    <button className="interact-btn"><FontAwesomeIcon icon={faThumbsUp}/> Like</button>| 
                    <button className="interact-btn"><FontAwesomeIcon icon={faComment}/> Comment</button>|
                    <button className="interact-btn"><FontAwesomeIcon icon={faShare}/> Share</button>
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