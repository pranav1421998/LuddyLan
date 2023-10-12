// src/components/Navbar.js

import './Navbar.css'
import icon from './Images/icon.png';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faUsers, faComment, faGear, faSignIn, faSignOut } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  
  const navigate = useNavigate();  
  // var to keep track of login status
  var [loginStatus, setLoginStatus] = useState(false);
  
  if (loginStatus = true) {
    return (
      <nav className="navbar">
        <div className="logo">
          <img src={icon} alt="Logo" />
          <div className="navbar2">
            <p onClick={() => navigate('/dashboard')}><FontAwesomeIcon icon={faHome}/>Home</p>
            <p onClick={() => navigate('/FriendRequests')}><FontAwesomeIcon icon={faUsers}/>Friends</p>
            <p onClick={() => navigate('/chat')}><FontAwesomeIcon icon={faComment}/>Chat</p>
            <p onClick={() => navigate('/profile')}><FontAwesomeIcon icon={faUser}/>Profile</p>
            <p onClick={() => navigate('/profileSettings')}><FontAwesomeIcon icon={faGear}/>Settings</p>
          </div>
        </div>
        <div className="login">
          <a href="/" onClick={() => setLoginStatus(false)}><FontAwesomeIcon icon={faSignOut}/> Log out</a>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="navbar">
        <div className="logo">
          <img src={icon} alt="Logo" />
        </div>
        <div className="login">
        <a href="/" onClick={() => setLoginStatus(true)}> <FontAwesomeIcon icon={faSignIn}/> Sign in</a>
        </div>
      </nav>
    );
  }

};


export default Navbar;
