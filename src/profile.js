import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './profile.css';

function Profile() {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // Fetch user info and posts from Firestore here
    // setUserInfo and setUserPosts with the retrieved data
  }, []);

  return (
    <div className='profile-container'>
      <h1>{userInfo.name}'s Profile</h1>
      {/* Display user info */}
      <button><Link to="/profileSettings">Settings</Link></button>
      <button><Link to="/dashboard">Dashboard</Link></button>
      <button><Link to="/CreatePost">Create Post</Link></button>
      {/* Map through userPosts to display each post and a delete button */}
    </div>
  );
}

export default Profile;
