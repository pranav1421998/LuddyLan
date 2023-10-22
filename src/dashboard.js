import './dashboard.css';
import Comments from './Comments';
import PollPopup from './CreatePoll';
import CreatePost from './CreatePost';
import { db, auth } from "./firebaseConfig";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  orderBy,
  query,
  collection,
} from "firebase/firestore";

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postComments, setPostComments] = useState({});
  const [newCommentText, setNewCommentText] = useState("");

  // Create an object to store the comment window state for each post
  const [commentWindows, setCommentWindows] = useState({});

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

  // Event handler to open the comment window for a specific post
  const openCommentWindow = (postId) => {
    // Use the object to toggle the comment window state for the specific post
    setCommentWindows({
      ...commentWindows,
      [postId]: !commentWindows[postId],
    });
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const collectionRef = collection(db, "posts");
      const q = query(collectionRef, orderBy("uploadedDate", "desc"));
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
          setUserDetails({ id: userDoc.id, ...userDoc.data() });
          try {
            await updateDoc(userDocRef, {
              loggedIn: true
            });
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

  // Function to format a date as a more readable string
  const formatTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    const options = {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
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
            .then(() => {
              console.log('User liked the post.');
            })
            .catch((error) => {
              console.error('Error adding like to Firestore: ', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error checking like status in Firestore: ', error);
      });
  };

  const fetchLikeCount = async (postId) => {
    const likesCollection = collection(db, "posts", postId, "likes");
    const querySnapshot = await getDocs(likesCollection);
    return querySnapshot.size;
  };

  // Function that allows user to like or unlike a post
  const toggleLike = async (postId) => {
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
                <div className="post-header">
                  <p className="user-icon"><FontAwesomeIcon icon={faUser}/></p>
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
                  <button className={`interact-btn like-button ${post.likedByUser ? "liked" : ""}`}
                    onClick={async () => {
                      const newLikeCount = await toggleLike(post.id);
                      post.likeCount = newLikeCount;
                      post.likedByUser = !post.likedByUser;
                      setPosts([...posts]);
                    }}>
                    <FontAwesomeIcon icon={faThumbsUp} /> {post.likeCount}
                  </button>|
                  <button className="interact-btn" onClick={() => openCommentWindow(post.id)}>
                    <FontAwesomeIcon icon={faComment} /> Comment
                  </button>|
                  <button className="interact-btn">
                    <FontAwesomeIcon icon={faShare} /> Share
                  </button>
                </div>
                {commentWindows[post.id] && (  // Use the commentWindows state to conditionally render the Comments component
                  <Comments postId={post.id} onClose={() => openCommentWindow(post.id)} />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Dashboard;