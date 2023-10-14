// src/components/Navbar.js

import './Navbar.css'
import icon from './Images/icon.png';
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignIn } from '@fortawesome/free-solid-svg-icons';

const Navbar2 = () => {
     
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

};


export default Navbar2;
