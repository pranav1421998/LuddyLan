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
          <button className='btn' onClick={() => navigate('/dashboard')}><FontAwesomeIcon icon={faHome}/> Home</button>
          <button className='btn' onClick={() => navigate('/FriendRequests')}><FontAwesomeIcon icon={faUsers}/> Friends</button>
          <button className='btn' onClick={() => navigate('/chat')}><FontAwesomeIcon icon={faComment}/> Chat</button>
          <button className='btn' onClick={() => navigate('/profile')}><FontAwesomeIcon icon={faUser}/> Profile</button>
          <button className='btn' onClick={() => navigate('/profileSettings')}><FontAwesomeIcon icon={faGear}/> Settings</button>
        </div>
        {/* log out */}
        <div className="login">
          <p onClick={() => navigate('/')}><FontAwesomeIcon icon={faSignOut}/> Log out</p>
        </div>
      </nav>
    );

};

export default Navbar;