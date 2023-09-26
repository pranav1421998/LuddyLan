import firebase from "firebase/app";
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
  const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((result) => {
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
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                <label htmlFor="password">password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button type="submit">Log In</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button>
        </div>
        <div className="login-container">
             <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    </>
  );
};

export default Login;