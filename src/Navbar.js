// src/components/Navbar.js

import React from 'react';
import './Navbar.css'
import icon from './Images/icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={icon} alt="Logo" />
      </div>
      <div className="login">
        <a href="/contact"> <FontAwesomeIcon icon={faUser} /> Sign In</a>
      </div>
    </nav>
  );
};


export default Navbar;