// src/components/Navbar.js

import './Navbar.css'
import icon from './Images/icon.png';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

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
          <p onClick={() => navigate('/FriendRequest')}>Friends</p>
          <p>Chat</p>
          <p>Profile</p>
          <p>Settings</p>
        </div>
        </div>
        <div className="login">
          <a href="/" onClick={() => setLoginStatus(false)}> <FontAwesomeIcon icon={faUser} /> Log out</a>
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
        <a href="/" onClick={() => setLoginStatus(true)}> <FontAwesomeIcon icon={faUser} /> Sign in</a>
        </div>
      </nav>
    );
  }

};


export default Navbar;
