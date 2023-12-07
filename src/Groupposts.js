import './Groupposts.css';
import Groups from './Groups';
import Cookies from 'js-cookie';
import Sidebar2 from './Sidebar2';
import Comments from './Comments';
import EditModal from './EditModal';
import { db, auth } from "./firebaseConfig";
import CreateGroupPosts from './CreateGroupposts';
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp, faShare,faClipboard, faComment, faImage, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { doc, getDoc, addDoc, getDocs, setDoc, deleteDoc, updateDoc, arrayUnion, orderBy, query, where, collection } from "firebase/firestore";

const Groupposts = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const{groupId, groupName} = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [commentWindows, setCommentWindows] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openShareDropdowns, setOpenShareDropdowns] = useState({});
  const [isDonateWindowOpen, setIsDonateWindowOpen] = useState(false);
    
  const user_email = Cookies.get('userDetails');

  const openPollPopup = () => { setShowPopup(true); };
  const ClosePollPopup = () => { setShowPopup(false); };
  const handleOpenModal = () => { setShowModal(true); };
  const handleCloseModal = () => { 
    setShowModal(false);
    addNotification(groupId, groupName); 
  };
  // Event handler to open the comment window for a specific post
  const openCommentWindow = (postId) => {
    setCommentWindows({
      ...commentWindows,
      [postId]: !commentWindows[postId],
    });
  };
  const toggleDonateWindow = () => {
    setIsDonateWindowOpen(!isDonateWindowOpen);
  };
  const handleProfilePictureUpdate = (file) => {};
  const handleEditButtonClick = () => { setIsEditModalOpen(true); };
  const handleCameraButtonClick = () => { fileInputRef.current.click(); };
  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleProfilePictureUpdate(selectedFile);
    }
  };
  const handleSaveEditedData = (editedData) => {
    setIsEditModalOpen(false);
    setUserInfo(editedData);
  };

    // TODO: Function to handle the donation process
    const handleDonate = () => {
      // Donation logic here
      // Redirect  user to a payment type or handle donations another way 
      console.log("Donation logic goes here!");
      // Closing the donation window for now
      toggleDonateWindow();
    };  

// Function to add a notification for each user (admin or follower) of the group
const addNotification = async (groupId, groupName) => {
  try {
    // Get the group document
    const groupDocRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupDocRef);

    if (groupDoc.exists()) {
      const groupData = groupDoc.data();

      // Get the admin and follower user IDs
      const adminUserIds = groupData.admins || [];
      const followerUserIds = groupData.followers || [];

      // Combine admin and follower user IDs
      const allUserIds = [...new Set([...adminUserIds, ...followerUserIds])];

      // Iterate through each user ID and add a notification
      for (const userId of allUserIds) {
        // Check if the user exists
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Check if the user already has a notification for this post
          const notificationsRef = collection(db, 'users', userId, 'notifications');
          const existingNotificationQuery = query(notificationsRef, where('postId', '==', groupId));
          const existingNotificationSnapshot = await getDocs(existingNotificationQuery);

          if (existingNotificationSnapshot.empty) {
            // Add a new notification
            const notificationMessage = `${userDetails.firstName + " " + userDetails.lastName} added a post to the ${groupName} group!`;
            await addDoc(notificationsRef, {
              message: notificationMessage,
              name: groupName,
              id: groupId
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error adding post notification:', error);
  }
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
  const handleCreatePost = () => {
    navigate(`/create-grouppost/${groupId}/${groupName}`);
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
        try {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, "users", user.email);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserDetails({ id: userDoc.id, ...userDoc.data() });
                    const userEmailAddress = user.email;
                    const postQuery = query(
                        collection(db, "posts"),
                        where("ownerId", "==", groupId), // Update this line to filter by group ID
                        orderBy("uploadedDate", "desc")
                      );
                    const postQuerySnapshot = await getDocs(postQuery);

                    const postPromises = postQuerySnapshot.docs.map(async (doc) => {
                        const postData = { id: doc.id, ...doc.data() };
                        postData.likeCount = await fetchLikeCount(doc.id);
                        postData.name = await getUserNamesByEmail(postData.ownerId);
                        return postData;
                    });

                    const postsData = await Promise.all(postPromises);
                    setPosts(postsData);
                } else {
                    console.log("No such document!");
                }
            } else {
                console.log("No user is signed in");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchData(); // Call fetchData directly on component mount

    const unsubscribe = onAuthStateChanged(auth, fetchData);
    return () => unsubscribe();
}, [auth, db]);

return (
    <section className="main">
        <Sidebar2 />
      <div className="top-btn-grp">
        <h3>Posts</h3>
        <button className="modal-btn-grp" onClick={handleOpenModal}>
            Create Post
        </button>

      </div>
        <div className="post-container">
        <div className="profile-img-container">
                <div className="circular-image">
                  <img
                    src="https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-group-icon-png-image_1796653.jpg"
                    alt="Profile Picture"
                    className="profile-picture"
                  />
                  <button className="camera-button" onClick={handleCameraButtonClick}>
                    📷
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                  />
                  
                </div>
                
                <div style={{ flexDirection: 'column' }}>
                <p className='public-button'><FontAwesomeIcon icon={faPenToSquare} onClick={handleEditButtonClick} /></p>
                  <p className="heading-profile">{groupName}</p>
                  <div className="friends-posts">
                    <p className="posts-count"><FontAwesomeIcon icon={faImage} />Posts: {userPosts.length}</p>
                  </div>
                  <button className="donate-btn" onClick={toggleDonateWindow}>Donate</button>
                </div>
                {isEditModalOpen && (
                  <EditModal
                    userData={groupName}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveEditedData}
                  />
                )}
              </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>close</span>
                        <CreateGroupPosts onClose={handleCloseModal} groupId={groupId} groupName={groupName}/>
                    </div>
                </div>
            )}
            {posts.map((post) => (
                <div key={post.id} className="post">
                    <div className="post-header">
                        <p className="user-icon">
                            
                 <FontAwesomeIcon icon={faUser}/> 
                        </p>
                        <div className="head">
                            <p className="username">{groupName}</p>                            
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
                          <FontAwesomeIcon icon={faThumbsUp}/> {post.likeCount}
                        </button>|
                        <button className="interact-btn" onClick={() => openCommentWindow(post.id)}>
                          <FontAwesomeIcon icon={faComment}/> Comment
                        </button>|
                        <button className="interact-btn" onClick={() => toggleShareDropdown(post.id)}>
                          <FontAwesomeIcon icon={faShare}/> Share
                        </button>
                      </div>
                      {/* Donation window */}
                      {isDonateWindowOpen && (
                        <div className="donation-window">
                          <h3>Donation Page</h3>
                          <div className="donation-content">
                            <label htmlFor="amount">Amount:</label>
                            <input type="text" id="amount" name="amount" placeholder="$0.00"/>
                            <button className="pay-btn" onClick={handleDonate}>Pay</button>
                          </div>
                          <p>Thank you for your donation(s).</p>
                        </div>
                      )}
                      {/* Comment window */}
                      {commentWindows[post.id] && (  
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
            ))}
        </div>
    </section>
  );
};

export default Groupposts;