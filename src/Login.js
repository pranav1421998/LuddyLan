import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig"; 
import React, { useState } from "react";
import {GoogleButton} from 'react-google-button';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import password from './password.js';
import './Login.css';

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }
  // Define the Google Sign-In method
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // Successful login. Redirect or update UI as needed.
                console.log("Logged in as:", result.user.displayName);
            })
            .catch((error) => {
                console.error("Error during Google sign-in:", error);
            });
  };

  return (
    <>
    <div className="background">
    <div className="auth-form-container">
            <h2>LOGIN</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                {/* <label htmlFor="email">Username</label> */}
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="username@iu.edu" id="email" name="Username" />
                {/* <label htmlFor="password">Password</label> */}
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="password" id="password" name="Password" />
                <button type="submit" onClick={handleSubmit}>Log In</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button>
            <div className="google-btn">
            <GoogleButton onClick={handleGoogleSignIn}></GoogleButton>
            </div>
        </div>
        </div>
    </>
  );
};


export default Login;