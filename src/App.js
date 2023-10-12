import { getAuth, onAuthStateChanged } from "firebase/auth";
import  {Register} from './Register.js';
import React, { useState } from "react";
import './App.css';
import Login from './Login.js';
import Dashboard from './dashboard';
import Profile from "./profile.js";
import ProfileSettings from "./profileSettings.js";

// routing
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Password from './password'; 
import PasswordRecovery from './passwordRecovery.js';
import Navbar from './Navbar.js';
import navbar2 from './Navbar2.js';
import FileUpload from './CreatePost.js';
import FriendRequests from './FriendRequests.js';

function App() {
    const auth = getAuth();  // Initialize the auth instance
    const [currentForm, setCurrentForm] = useState('login');
    const toggleForm = (formName) => {
        setCurrentForm(formName);
    }
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            console.log("(From App)User signed in:", user.displayName);
        } else {
            // User is signed out
            console.log("(From App)User is signed out.");
        }
    });
   
    return (

        
        <Router>
            <div className="App">
                <Navbar></Navbar>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/password" element={<Password />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/passwordrecovery" element={<PasswordRecovery/>} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/CreatePost" element={<FileUpload></FileUpload>}/>
                    <Route path="/friendRequests" element={<FriendRequests />} />
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/profileSettings" element={<ProfileSettings/>}/>
                </Routes>
            </div>
        </Router>

    );
}

export default App;