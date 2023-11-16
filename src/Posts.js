import './dashboard.css';
import Cookies from 'js-cookie';
import Comments from './Comments';
import { db, auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { faUser, faThumbsUp, faComment, faShare, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { doc, getDoc, getDocs, setDoc, deleteDoc, orderBy, query, where, collection } from "firebase/firestore";

const Posts = () => {
    // From dashboard.js
    const [userDetails, setUserDetails] = useState(null);
    const [posts, setPosts] = useState([]);
    const [commentWindows, setCommentWindows] = useState({}); // Comments window drop down
    const [openShareDropdowns, setOpenShareDropdowns] = useState({});
    const [isLikedByUser, setIsLikedByUser] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const [profilePicture, setProfilePicture] = useState(null);
    const searchParams = new URLSearchParams(location.search);
    const postId = searchParams.get('pid');
    const [post, setPost] = useState(null);

    // Event handler to open the comment window for a specific post
  const openCommentWindow = (postId) => {
    // Use the object to toggle the comment window state for the specific post
    setCommentWindows({
      ...commentWindows,
      [postId]: !commentWindows[postId],
    });
  };

  // Function to format a date as a more readable string
  const formatTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    const options = { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleString(undefined, options);
  };
 
  const addLikeToPost = (postId, userId) => {
    const likesCollection = collection(db, 'posts', postId, 'likes');
    const likeDocRef = doc(likesCollection, userId);
    getDoc(likeDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          console.log('User has already liked this post.');
        } else {
          setDoc(likeDocRef, { liked: true })
          .then(() => { console.log('User liked the post.'); })
          .catch((error) => { console.error('Error adding like to Firestore: ', error); });
        }
      })
      .catch((error) => { console.error('Error checking like status in Firestore: ', error); });
  };
 
  const fetchLikeCount = async (postId) => {
    const likesCollection = collection(db, "posts", postId, "likes");
    const querySnapshot = await getDocs(likesCollection);
    return querySnapshot.size;
  };
 
  // Function that allows user to like or unlike a post
  const toggleLike = async (postId) => {
    if(postId && userDetails) {
        const likesCollection = collection(db, "posts", postId, "likes");
        const likeDocRef = doc(likesCollection, userDetails.id);
        try {
        const docSnapshot = await getDoc(likeDocRef);
        if (docSnapshot.exists()) {
            await deleteDoc(likeDocRef);
        } else {
            await setDoc(likeDocRef, { liked: true });
        }
        const likeCount = await fetchLikeCount(postId);
        return likeCount;
        } catch (error) {
        console.error("Error toggling like status: ", error);
        }
    }
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

  const toggleShareDropdown = (postId) => {
    setOpenShareDropdowns((prevOpenDropdowns) => ({
      ...prevOpenDropdowns,
      [postId]: !prevOpenDropdowns[postId],
    }));
  };  

  // Function that copies text in textarea to user's clipboard
  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Copied to clipboard!");
  };

  // Function to generate the URL so the user can copy and share the post
  const generatePostURL = (postId) => {
    // Replace with actual URL after deploying!
    return `http://localhost:3000/Posts?pid=${postId}`;
  };

  async function getProfilePicByEmail(email) {
    try {
      const userDocRef = doc(db, 'users', email);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const pic = userData.profilePicture;
        return pic;
      } else {
        console.log('No profile picture for user with email: ', email);
        return null;
      }
    } catch (error) { 
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  async function getUserNamesByEmail(email) {
    try {
      const userDocRef = doc(db, 'users', email);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const firstName = userData.firstName;
        const lastName = userData.lastName;
        return { firstName, lastName };
      } else {
        console.log('No such document for user with email: ', email);
        return null;
      }
    } catch (error) { 
      console.error('Error fetching user data:', error);
      return null;
    }
  }
  
    useEffect(() => {
        const fetchData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, "users", user.email);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserDetails({ id: userDoc.id, ...userDoc.data() });
                    const userEmailAddress = user.email;
                }
            }
        }

        const fetchPost = async () => {
          try {
            const postDocRef = doc(db, "posts", postId);
            const postDoc = await getDoc(postDocRef);
    
            if (postDoc.exists()) {
                const postData = { id: postDoc.id, ...postDoc.data() };
                postData.likeCount = await fetchLikeCount(postDoc.id);
                postData.name = await getUserNamesByEmail(postData.ownerId);
                setPost(postData);
                // Getting profile picture for post
                const pic = await getProfilePicByEmail(postData.ownerId);
                setProfilePicture(pic);
            } else {
              console.error("No such document for post:", postId);
            }
          } catch (error) {
            console.error("Error fetching post:", error);
          }
        };
    
        fetchData();
        fetchPost();
    }, [auth, db, postId]);


    return (
        <section className='main'>
            <div className="post-container">
                {post && (
                <div className="post">

                    {/* Header */}
                    <div className="post-header">
                        <p className="user-icon">
                            <img src={profilePicture} alt="Profile" className="profile-picture"/>                        
                        </p>
                        <div className="head">
                            <p className="username">{post.name.firstName} {post.name.lastName}</p>
                            <p className="date">{formatTimestamp(post.uploadedDate)}</p>
                        </div>
                    </div>

                    {/* Caption */}
                    <div className="post-detail">
                        <p style={{ color: 'black' }}>{post.caption}</p>
                    </div>

                    <div className="post-feed">
                        <img src={post.media} className="image-container" alt="Image" />
                    </div>

                    <div className="detail-interactions">
                        <button className={`interact-btn like-button ${post.likedByUser ? "liked" : ""}`}
                            onClick={async () => {
                                const newLikeCount = await toggleLike(postId);
                                setPost((prevPost) => ({
                                    ...prevPost,
                                    likeCount: newLikeCount,
                                    likedByUser: !prevPost.likedByUser,
                                }));
                            }}>
                            <FontAwesomeIcon icon={faThumbsUp}/> {post.likeCount}
                        </button>|
                        <button className="interact-btn" onClick={() => openCommentWindow(post.id)}>
                            <FontAwesomeIcon icon={faComment}/> Comment
                        </button>|
                        <button className="interact-btn" onClick={() => toggleShareDropdown(post.id)}>
                            <FontAwesomeIcon icon={faShare}/> Share
                        </button>
                    </div>

                    {/* Comment window */}
                    {commentWindows[post.id] && (  // Use the commentWindows state to conditionally render the Comments component
                    <Comments postId={post.id} onClose={() => openCommentWindow(post.id)}/>
                    )}
                    {/* Share window */}
                    {openShareDropdowns[post.id] && (
                    <div className="share-dropdown">
                        <p className="text-share">Share this post:</p>
                        <input type="text" value={generatePostURL(post.id)} readOnly />
                        <button className="share-btn" onClick={() => copyToClipboard(generatePostURL(post.id))}><FontAwesomeIcon icon={faClipboard}/></button>
                    </div>
                    )}

                </div>
                )}
            </div>
        </section>
    );
    
};

export default Posts;