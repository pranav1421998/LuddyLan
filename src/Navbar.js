// src/components/Navbar.js

import './Navbar.css'
import icon from './Images/icon.png';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faUsers, faComment, faGear, faSignOut, faSignIn  } from '@fortawesome/free-solid-svg-icons';
//firebase
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
//cookies
import Cookies from 'js-cookie';

const Navbar = () => {
  
  const navigate = useNavigate();   
  const isLoggedIn = Cookies.get('isLoggedIn');
  const [searchResults, setSearchResults] = useState([]);

  const handleLogout =  () => {
    Cookies.remove('isLoggedIn');
    Cookies.remove('userDetails')
    navigate('/');    
  };

  const handleSearch = async (queryText) => {
    setSearchResults([]);
    
    if (queryText) {
      const usersCollection = collection(db, 'users');
      
      // Fetch users with matching firstName
      const firstNameQuery = query(usersCollection, where('firstName', '==', queryText));
      const firstNameSnapshot = await getDocs(firstNameQuery);
      
      // Fetch users with matching lastName
      const lastNameQuery = query(usersCollection, where('lastName', '==', queryText));
      const lastNameSnapshot = await getDocs(lastNameQuery);
      
      // Merge and set the results
      const users = [...firstNameSnapshot.docs, ...lastNameSnapshot.docs].map(doc => doc.data());
      setSearchResults(users);
    }
  };

/////////////////////
///////returns///////
/////////////////////
if (isLoggedIn) {
  //logged in navbar
  return (

    <nav className="navbar">
      {/* logo */}
      <div className="logo">
        <img src={icon} alt="Logo" />
      </div>
      {/* Search bar */}
      <div className="search-container">
      <input
          type="text"
          className="search-bar"
          placeholder="Search users and posts"
          onChange={(e) => handleSearch(e.target.value)}
        />
      {/* Search results dropdown */}
      {searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map((result, index) => (
              <div key={index} className="search-result">
                {/* Customize the display of users and posts here */}
                {result.firstName ? `${result.firstName} ${result.lastName}` : result.caption}
              </div>
            ))}
          </div>
        )}

      </div>
      {/* other webpage links */}
      <div className="pages">
        <button className='nav-btn' onClick={() => navigate('/dashboard')}><FontAwesomeIcon icon={faHome}/>&nbsp;Home</button>
        <button className='nav-btn' onClick={() => navigate('/FriendRequests')}><FontAwesomeIcon icon={faUsers}/>&nbsp;Friends</button>
        <button className='nav-btn' onClick={() => navigate('/chat')}><FontAwesomeIcon icon={faComment}/>&nbsp;Chat</button>
        <button className='nav-btn' onClick={() => navigate('/profile')}><FontAwesomeIcon icon={faUser}/>&nbsp;Profile</button>
        <button className='nav-btn' onClick={() => navigate('/profileSettings')}><FontAwesomeIcon icon={faGear}/>&nbsp;Settings</button>
      </div>
      {/* log out */}
      <div className="login">
        <button className='nav-btn' onClick={handleLogout}><FontAwesomeIcon icon={faSignOut}/>&nbsp;Log out</button>
      </div>
    </nav>
  );
} else {
  Cookies.remove('userDetails');
  // logged out navbar
  return (
    <nav className="navbar2">
      <div className="logo">
        <img src={icon} alt="Logo" />
      </div>
      <div className="login">
      <a href="/"> <FontAwesomeIcon icon={faSignIn}/> Sign in</a>
      </div>
    </nav>
  );
}

};

export default Navbar;