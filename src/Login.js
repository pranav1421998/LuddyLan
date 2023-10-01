import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig"; 
import React, { useState } from "react";
import {GoogleButton} from 'react-google-button';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword} from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import './Login.css';


const Login = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            console.log('User logged in:', userCredential.user);
            navigate('/dashboard'); // Replace with the route you want to navigate to upon successful login
        } catch (error) {
            console.error('Error during sign-in:', error);
            if (error.code === 'auth/wrong-password') {
                setError('Incorrect password. Please try again.');
            } else if (error.code === 'auth/user-not-found') {
                setError('No account found with this email. Please register.');
            } else {
                setError('Error during sign-in. Please try again.');
            }
        }
    };


  // Define the Google Sign-In method
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // Successful login.
                console.log("Logged in as:", result.user.displayName);
                navigate("/dashboard");  // Navigate to Password.js page
            })
            .catch((error) => {
                console.error("Error during Google sign-in:", error);
            });
  };

  return (
    <>
    <div className="background">
    <div className="auth-form-container">
            <h1>LOGIN</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                {/* <label htmlFor="email">Username</label> */}
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="username@iu.edu" id="email" name="Username" />
                {/* <label htmlFor="password">Password</label> */}
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="password" id="password" name="Password" />
                <button type="submit" onClick={handleSubmit}>Log In</button>
                <button className="link-btn" onClick={() => navigate("/register")}>Don't have an account? Register here.</button>
                <Link to="/passwordrecovery">Forgot Password?</Link>
            </form>

            <div className="google-btn">
            <GoogleButton onClick={handleGoogleSignIn}></GoogleButton>
            </div>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
        </div>
    </>
  );
};


export default Login;