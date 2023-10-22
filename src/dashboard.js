import './dashboard.css';
import PollPopup from './CreatePoll'; 
import CreatePost from './CreatePost';
import { db, auth } from "./firebaseConfig";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import { doc, getDoc, getDocs, setDoc, addDoc, deleteDoc, updateDoc, orderBy, query, collection } from "firebase/firestore";

const Dashboard = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postComments, setPostComments] = useState({}); // State to store comments for each post
    const [newCommentText, setNewCommentText] = useState("");

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
        const fetchPosts = async () => {
            const collectionRef = collection(db, "posts");
            const q = query(collectionRef, orderBy("uploadedDate", "desc")); // Order by "uploadedDate" in descending order (most recent to least recent)
            const querySnapshot = await getDocs(q);
            const postArray = [];
            
            // Fetch and add like count for each post
            for (const doc of querySnapshot.docs) {
                const postId = doc.id;
                const postData = doc.data();
                const likeCount = await fetchLikeCount(postId);
                postArray.push({ id: postId, ...postData, likeCount });
            }

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

    const addLikeToPost = (postId, userId) => {
        const likesCollection = collection(db, 'posts', postId, 'likes');
        // Check if the user has already liked the post
        const likeDocRef = doc(likesCollection, userId);
        getDoc(likeDocRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    // The user has already liked the post, you may want to handle this case
                    console.log('User has already liked this post.');
                } else {
                    // The user hasn't liked the post, so add their ID to the 'likes' collection
                    setDoc(likeDocRef, { liked: true })
                    .then(() => {console.log('User liked the post.');})
                    .catch((error) => {console.error('Error adding like to Firestore: ', error);});
                }
            })
            .catch((error) => {console.error('Error checking like status in Firestore: ', error);});
    };
    
    const fetchLikeCount = async (postId) => {
        const likesCollection = collection(db, "posts", postId, "likes");
        const querySnapshot = await getDocs(likesCollection);
        return querySnapshot.size; // Returns the number of likes for the post
    };

    // Function that allows user to like or unlike a post 
    const toggleLike = async (postId) => {
        const likesCollection = collection(db, "posts", postId, "likes");
        const likeDocRef = doc(likesCollection, userDetails.id);
    
        try {
            const docSnapshot = await getDoc(likeDocRef);
    
            if (docSnapshot.exists()) {
                // User has already liked the post, so "unlike" it
                await deleteDoc(likeDocRef); // Remove the user's ID from the "likes" collection
            } else {
                // User hasn't liked the post, so "like" it
                await setDoc(likeDocRef, { liked: true });
            }
    
            // Update the like count for the post
            const likeCount = await fetchLikeCount(postId);
            return likeCount;
        } catch (error) {
            console.error("Error toggling like status: ", error);
        }
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
                    <button className={`interact-btn like-button ${post.likedByUser ? "liked" : ""}`}
                        onClick={async () => {
                            const newLikeCount = await toggleLike(post.id);
                            // Update the like count and likedByUser status for the post
                            post.likeCount = newLikeCount;
                            post.likedByUser = !post.likedByUser;
                            setPosts([...posts]); // Update the state
                        }}>
                        <FontAwesomeIcon icon={faThumbsUp} /> {post.likeCount - 1}
                </button>|
                    
                    <button className="interact-btn">
                        <FontAwesomeIcon icon={faComment}/> Comment
                    </button>|

                    <button className="interact-btn">
                        <FontAwesomeIcon icon={faShare}/> Share
                    </button>
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