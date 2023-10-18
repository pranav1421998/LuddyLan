// src/components/Navbar.js

import './Navbar.css'
import icon from './Images/icon.png';
import React, { useEffect } from "react";
import { auth, db } from "./firebaseConfig"; 
import { doc, getDoc, updateDoc} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faUsers, faComment, faGear, faSignOut } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  
  const navigate = useNavigate();   

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
          <button className='nav-btn' onClick={() => navigate('/')}><FontAwesomeIcon icon={faSignOut}/>&nbsp;Log out</button>
        </div>
      </nav>
    );

};

export default Navbar;