import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig"; 
import "firebase/auth";
import React, { useState } from "react";
import {GoogleButton} from 'react-google-button';
const Login = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }
  // Define the Google Sign-In method
  const app = initializeApp(firebaseConfig);
  const signInWithGoogle = () => {
      const provider = new app.auth.GoogleAuthProvider();
      app.auth().signInWithPopup(provider).then((result) => {
          const user = result.user;
          // Redirect or navigate to another page after successful login, if desired
          console.log("Logged in as:", user.displayName);
      }).catch((error) => {
          console.error("Error during Google sign-in:", error);
      });
  };

  return (
    <>
    <div className="auth-form-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Username</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="username@iu.edu" id="email" name="Username" />
                <label htmlFor="password">Password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="Password" />
                <button type="submit">Log In</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button>
            <GoogleButton onClick={signInWithGoogle}></GoogleButton>
        </div>
    </>
  );
};

export default Login;