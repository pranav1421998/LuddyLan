import { getAuth, onAuthStateChanged } from "firebase/auth";
import  {Register} from './Register.js';
import React, { useState } from "react";
import './App.css';
import Login from './Login.js';

// routing
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Password from './password'; 

import Navbar from './Navbar.js';


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
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/password" element={<Password />} />
                    <Route path="/register" element={<Register />} />

                </Routes>
            </div>
        </Router>

    );
}

export default App;