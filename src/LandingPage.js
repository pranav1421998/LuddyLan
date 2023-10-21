import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import BannerBackground from './Images/home-banner-background.png';
import BannerImage from './Images/LuddySocial.jpg';
import BackdropImage from './Images/luddy.png';
import './LandingPage.css';
const LandingPage = () => {
  const backdropStyle = {
    backgroundImage: `url(${BackdropImage})`, // Set the backdrop image
    backgroundSize: "cover", // Adjust the background size as needed
    backgroundPosition: "center", // Adjust the background position as needed
  };
  return (
    <div className="home-container" style={backdropStyle}>
      <Navbar />
      <div className="home-banner-container">
        <div className="home-text-section">
          <h1 className="primary-heading">
          Welcome to our Luddy Lan
          </h1>
          <p className="primary-text">
          Connect with friends, share your thoughts, and stay updated with the latest happenings.
        </p>
        <Link to='/login'>
          <button className="secondary-button">
            Login Now <FiArrowRight />{" "}
          </button>
          </Link>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;