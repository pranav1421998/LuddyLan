import React from "react";
import ImageSlider from "./ImageSlider";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import BannerBackground from './Images/home-banner-background.png';
import BannerImage from './Images/LuddySocial.jpg';
import BackdropImage from './Images/color.jpg';
import image1 from './Images/1.png';
import image2 from './Images/2.png';
import image3 from './Images/3.png';
import image4 from './Images/4.png';
import image5 from './Images/5.png';
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
          Welcome to Luddy LAN
          </h1>
          <p className="primary-text">
          Connect with friends, share your thoughts, and stay updated with all the latest happenings.
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
      <div class="slider">
        <div class="slide-track">
          <div class="slide">
            <img src={image1} alt=""/>
          </div>
          <div class="slide">
            <img src={image2} alt=""/>
          </div>
          <div class="slide">
            <img src={image3} alt=""/>
          </div>
          <div class="slide">
            <img src={image4} alt=""/>
          </div>
          <div class="slide">
            <img src={image5} alt=""/>
          </div>
        </div>
      </div>
      <footer className="footer">
      <p> Contact Us: <a className="contact-info" href="mailto:luddy@iu.edu">luddy@iu.edu</a></p>
    </footer>
    </div>
  );
};

export default LandingPage;