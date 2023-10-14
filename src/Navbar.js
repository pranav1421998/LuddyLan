import './Navbar.css'
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import icon from './Images/icon2.png';
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
          <p onClick={() => navigate('/dashboard')}><FontAwesomeIcon icon={faHome}/> Home</p>
          <p onClick={() => navigate('/FriendRequests')}><FontAwesomeIcon icon={faUsers}/> Friends</p>
          <p onClick={() => navigate('/chat')}><FontAwesomeIcon icon={faComment}/> Chat</p>
          <p onClick={() => navigate('/profile')}><FontAwesomeIcon icon={faUser}/> Profile</p>
          <p onClick={() => navigate('/profileSettings')}><FontAwesomeIcon icon={faGear}/> Settings</p>
        </div>
        {/* log out */}
        <div className="login">
          <p onClick={() => navigate('/')}><FontAwesomeIcon icon={faSignOut}/> Log out</p>
        </div>
      </nav>
    );

};

export default Navbar;