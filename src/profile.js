import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './profile.css';
import Sidebar from './Sidebar';
import userImage from './Images/user.jpg';
import { doc, getDoc, collection, query, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';


function Profile() {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    
    const auth = getAuth();
    const userEmail = auth.currentUser ? auth.currentUser.email : null;

    // Fetch user details
    const userRef = doc(db, 'users', userEmail);
    getDoc(userRef).then(docSnapshot => {
      if (docSnapshot.exists()) {
        setUserInfo({id: docSnapshot.id, ...docSnapshot.data()});
      }
    });

    // Fetch user posts
    const postsQuery = query(collection(db, `users/${userEmail}/posts`));
    getDocs(postsQuery).then(async(querySnapshot) => {
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,     // Store the document ID
        ...doc.data(),  // Store the post data
        //url: await getDownloadURL(ref(getStorage(), doc.Media))
      }));
      
      setUserPosts(posts);
      console.log(posts)    
    });
    
    
  }, []);

  return (
    <div className='container'>
      <Sidebar />
      <div className='main-content'>
        <h1 className='profile-header'>{userInfo.firstName}'s Profile</h1>
        <div className='profile-card'>
        <img src={userImage} alt="Profile Picture" className='profile-picture' />
          {/*user information*/}
          <p>Name: {userInfo.firstName}</p>
          <p>Email: {userInfo.id}</p>
        </div>
        <div className='post-container'>
        {/* Map through userPosts to display each post and a delete button */}
        {userPosts.map(post => (
          <div className='post-card' key={post.id}>
            {/* Display post content here */}
            <p>Post ID: {post.id}</p>
            <p>Caption: {post.Caption}</p>
            <img src={post.Media} alt="Post" className='image'/>
            {/* Add a delete button for each post */}
            <button className='button'>Delete</button>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
