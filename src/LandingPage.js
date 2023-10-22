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
    // backgroundImage: `url(${BackdropImage})`, // Set the backdrop image
    backgroundSize: "cover", // Adjust the background size as needed
    backgroundPosition: "center", // Adjust the background position as needed
  };
  // return (
  //   <div className="home-container" style={backdropStyle}>
  //     <Navbar />
  //     <div className="home-banner-container">
  //       <div className="home-text-section">
  //         <h1 className="primary-heading">
  //         Welcome to Luddy Lan
  //         </h1>
  //         <p className="primary-text">
  //         Connect with friends, share your thoughts, and stay updated with the latest happenings.
  //       </p>
  //       <Link to='/login'>
  //         <button className="secondary-button">
  //           Login Now <FiArrowRight />{" "}
  //         </button>
  //         </Link>
  //       </div>
  //       <div className="home-image-section">
  //         {/* <img src={'https://luddy.indiana.edu/images/news/2022/luddynetgraphic.png'} alt="" /> */}
  //         <img src={'https://luddy.indiana.edu/images/student-life/student-ambassadors/2022/2022-luddy-ambassadors-group-desktop.jpg'} alt="" />

  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div>
    <div className="home-container" style={backdropStyle}>
      <Navbar />
      <div className="header-image">
      <img style = {{height: '50vh'}} src={'https://luddy.indiana.edu/images/student-life/student-ambassadors/2022/2022-luddy-ambassadors-group-desktop.jpg'} alt="" />
      </div>
      <div>
      <div className="home-text-section">
          <h1 className="primary-heading">
          Welcome to Luddy Lan
          </h1>
          <p className="primary-text">
          Connect with Luddy students, share your thoughts and stay informed.
        </p>
        <Link to='/login'>
          <button className="secondary-button">
            Login Now <FiArrowRight />{" "}
          </button>
          </Link>
        </div>
        
        <div style = {{width: '100vw'}} className="about-us-container">
          <div style={{padding: '10vh'}}>
          <img className="padding-img" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9PZlASlkOka7kLrNhhYp4syKJYVXq8VIZYw&usqp=CAU"></img>
          <img className="padding-img" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIs7YSW34v7Uy_GmdR3a7R7i_DPnl63UK1HYA4b8GE1IzDOecTXUSDT98Fct3fm5PZveE&usqp=CAU"></img>
          <img className="padding-img" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmYgQa_CoPYOf_PWUPjZ6OkCFfWspPxtRcXTNPHEdcDo0ownyrFc9ixhiKZIMBT7QBQw&usqp=CAU"></img>
          <img className="padding-img" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyFpzTp9Cp61knb-B2nuswkbe0tdzsAJBoNg&usqp=CAU"></img>
          <img className="padding-img" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmZvKjyc4OcI_0gvY4xs0fnBoiylIKX2XKEg&usqp=CAU"></img>
          </div>
        </div>
        <h1 className="primary-heading">
        Want to know our story?
          </h1>
          <p className="primary-text">
          Our students are creative, enthusiastic, enterprising and determined
        </p>
          <div className="home-text-section">
          <Link to='/login'>
          <button className="secondary-button">
            About Us <FiArrowRight />{" "}
          </button>
          </Link>
          </div>

      </div>
    </div>
    <div style = {{width: '100vw'}} className="footer">
    <p> Contact Us @ "luddy@iu.edu"</p>
  </div>
  </div>
  );
};

export default LandingPage;