import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from './UserContext'; // Import the UserProvider
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { Register } from "./Register.js";
import Login from "./Login.js";
import Dashboard from "./dashboard";
import Profile from "./profile.js";
import ProfileSettings from "./profileSettings.js";
import Password from "./password";
import PasswordRecovery from "./passwordRecovery.js";
import Navbar from "./Navbar.js";
import FileUpload from "./CreatePost.js";
import FriendRequests from "./FriendRequests.js";
import AllUsers from "./AllUsers.js";
import MyFriends from "./MyFriends";
import './App.css';

function App() {
  const auth = getAuth(); // Initialize the auth instance
  const [currentForm, setCurrentForm] = React.useState("login");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      console.log("(From App) User signed in:", user.displayName);
    } else {
      // User is signed out
      console.log("(From App) User is signed out.");
    }
  });

  return (
    <UserProvider > {/* Wrap your app with the UserProvider */}
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/password" element={<Password />} />
            <Route path="/register" element={<Register />} />
            <Route path="/passwordrecovery" element={<PasswordRecovery />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/CreatePost" element={<FileUpload />} />
            <Route path="/friendRequests" element={<FriendRequests />} />
            <Route path="/allUsers" element={<AllUsers />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profileSettings" element={<ProfileSettings />} />
            <Route path="/myFriends" element={<MyFriends />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
