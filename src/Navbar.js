// src/components/Navbar.js

import './Navbar.css'
import icon from './Images/icon.png';
import React, { useEffect } from "react";
import { auth, db } from "./firebaseConfig"; 
import { doc, getDoc, updateDoc} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faUsers, faComment, faGear, faSignOut, faSignIn  } from '@fortawesome/free-solid-svg-icons';
//cookies
import Cookies from 'js-cookie';

const Navbar = () => {
  
  const navigate = useNavigate();   
  const isLoggedIn = Cookies.get('isLoggedIn');

  const handleLogout =  () => {
    Cookies.remove('isLoggedIn');
    navigate('/');    
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