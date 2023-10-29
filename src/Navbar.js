// src/components/Navbar.js

import './Navbar.css'
import icon from './Images/icon.png';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faUsers, faComment, faGear, faSignOut, faSignIn, faSearch  } from '@fortawesome/free-solid-svg-icons';
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
        
        // Fetch all users
        const allUsersSnapshot = await getDocs(usersCollection);
        
        // Filter users based on the presence of queryText in firstName or lastName, case-insensitively
        const users = allUsersSnapshot.docs.map(doc => doc.data())
            .filter(user => 
                user.firstName.toLowerCase().includes(queryText.toLowerCase()) || 
                user.lastName.toLowerCase().includes(queryText.toLowerCase())
            );
        
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
              placeholder="Search"
              onChange={(e) => handleSearch(e.target.value)} 
          />
          {searchResults.length > 0 && (
              <div className="search-dropdown">
                  {searchResults.map((user, index) => (
                      <div key={index} className="search-dropdown-item">
                          {user.firstName} {user.lastName}
                          {/* You can also add more user details or a link to the user's profile here */}
                      </div>
                  ))}
              </div>
          )}
          <FontAwesomeIcon 
          icon={faSearch} 
          className="search-icon"
          onClick={() => navigate('/searchResults')}
        />
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