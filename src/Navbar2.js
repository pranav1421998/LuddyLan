// src/components/Navbar.js

import './Navbar.css'
import icon from './Images/icon.png';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faUsers, faComment, faGear, faSignIn, faSignOut } from '@fortawesome/free-solid-svg-icons';

const Navbar2 = () => {
  
  const navigate = useNavigate();  
  // var to keep track of login status
  var [loginStatus, setLoginStatus] = useState(false);
  
   
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

};


export default Navbar2;
