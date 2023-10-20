import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './profile.css';
import Sidebar from './Sidebar';
import userImage from './Images/user.jpg';
import { doc, getDoc, collection, query, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function Profile() {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
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
            }
          });
          const postsQuery = query(collection(db, `users/${userEmail}/posts`));
          getDocs(postsQuery).then(async (querySnapshot) => {
            const posts = querySnapshot.docs.map(doc => ({
              id: doc.id,     // Store the document ID
              ...doc.data(),  // Store the post data
              //url: await getDownloadURL(ref(getStorage(), doc.Media))
            }));
            setUserPosts(posts);
          });
      } else {
        setUserInfo({});
        setUserPosts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleProfilePictureUpdate = (file) => {
    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, `profile_pictures/${userInfo.id}`);

      uploadBytes(storageRef, file)
        .then(() => {
          getDownloadURL(storageRef)
            .then((downloadURL) => {
              const userRef = doc(db, 'users', userInfo.id);
              updateDoc(userRef, {
                profilePicture: downloadURL,
              });

              setUserInfo({ ...userInfo, profilePicture: downloadURL });
            })
            .catch((error) => {
              console.error('Error getting download URL:', error);
            });
        })
        .catch((error) => {
          console.error('Error uploading profile picture:', error);
        });
    }
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

  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <div className="post-container">
          <div className="profile-image-container">
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
          </div>
          <h1 className="profile-header">{userInfo.firstName}'s Profile</h1>
          {userPosts.map((post) => (
            <div className="post" key={post.id}>
              <p>Post ID: {post.id}</p>
              <p>Caption: {post.Caption}</p>
              <img src={post.Media} alt="Post" className="post-image" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
