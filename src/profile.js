import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './profile.css';
import Sidebar from './Sidebar';
import userImage from './Images/user.jpg';
import { doc, getDoc, collection, query, getDocs, updateDoc, where } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { faHome, faUser, faUsers, faComment, faImage, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Switch from 'react-switch'; // Import the slider toggle component

function Profile() {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isPublic, setIsPublic] = useState(false); // Track whether profile is public
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userEmail = user.email;
        const userRef = doc(db, 'users', userEmail);
        getDoc(userRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = { id: docSnapshot.id, ...docSnapshot.data() };
              setUserInfo(userData);
              setIsPublic(userData.isPublic || false); // Initialize with user's public setting
  
              // Fetch posts
              fetchUserPosts(userData.id);
            }
          });
      } else {
        setUserInfo({});
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  // Function to fetch user posts
  const fetchUserPosts = (userId) => {
    const postsQuery = query(collection(db, 'posts'), where('ownerId', '==', userId));
    getDocs(postsQuery)
      .then((querySnapshot) => {
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserPosts(posts);
      })
      .catch((error) => {
        console.error('Error fetching user posts:', error);
      });
  };
  
  const handleProfilePictureUpdate = (file) => {
    // (Your existing code for updating the profile picture)
  };

  const handleCameraButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleProfilePictureUpdate(selectedFile);
    }
  };

  const togglePublic = () => {
    const userRef = doc(db, 'users', userInfo.id);
    updateDoc(userRef, { isPublic: !isPublic }); // Toggle the public setting
    setIsPublic(!isPublic); // Update the state
  };


  return (
    <div>
      <Sidebar />
      <div className="modal-container">
        <div className="component">
          <div className="title">
            <h2>{userInfo.firstName}'s Profile</h2>
          </div>
          <div className="container">
            <div className="profile-container">
              <div className="profile-img-container">
                <div className="circular-image">
                  <img
                    src={userInfo.profilePicture || userImage}
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
                <p className='public-button'><FontAwesomeIcon icon={faPenToSquare} /></p>
                  <p className="heading-profile">{userInfo.firstName} {userInfo.lastName}</p>
                  <p className="email-profile">{userInfo.id}</p>
                  <div className="friends-posts">
                    <p className="friends-count"><FontAwesomeIcon icon={faUsers} />Friends: 0</p>
                    <p className="posts-count"><FontAwesomeIcon icon={faImage} />Posts: 0</p>
                    <p className='friends-count'>Make it public: <Switch // Use the Switch component for the toggle
                      checked={isPublic}
                      onChange={togglePublic}
                    /></p>
                  </div>
                </div>
                
              </div>
              <h4 className='posts-heading'>Posts</h4>
              <div className="posts-grid">
              {userPosts.map((post) => (
                <div className="post-profile" key={post.id}>
                  <img
                    src={post.media}
                    alt="Post"
                    className="post-image"
                  />
                  <p className="post-caption">{post.Caption}</p>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;