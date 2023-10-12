import { auth, db, provider } from "./firebaseConfig"; 
import { doc, getDoc } from 'firebase/firestore';
import React, { useState, useEffect } from "react";
import {GoogleButton} from 'react-google-button';
import { signInWithPopup, signInWithEmailAndPassword} from "firebase/auth";
import { useNavigate,Link } from "react-router-dom";
import './Login.css';


const Login = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const changeLoginStatus = (e) => {
        // create a reference of the collection's document
        const user_email = e.user.email;
        const userDocRef = doc(db, 'users', user_email);
        console.log("loggedIn: " + userDocRef.loggedIn)
        // Update the "loggedIn" in the document
        if (userDocRef.loggedIn=true) {
            userDocRef.update({loggedIn: false})
            .then(() => { console.log('Document field updated successfully'); })
            .catch((error) => { console.error('Error updating document field:', error); }); 
        } else {
            userDocRef.update({loggedIn: true})
            .then(() => { console.log('Document field updated successfully'); })
            .catch((error) => { console.error('Error updating document field:', error); }); 
        }    
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            console.log('User logged in:', userCredential.user);
            const user_email = e.user.email;
            const userDocRef = doc(db, 'users', user_email); 
            navigate('/dashboard'); // Replace with the route you want to navigate to upon successful login
            changeLoginStatus();
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

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, provider)
            .then(async(result) => {
                // Successful login.
                const user_email = result.user.email;
                // Retrieve the document with ID equal to user_email from 'users' collection
                const userDocRef = doc(db, 'users', user_email);
                const userDocSnapshot = await getDoc(userDocRef);
                if (!userDocSnapshot.exists()) { // Check if the document exists
                    // User not found, redirect to Register.js with email
                    navigate('/register', { state: { email: user_email } });
                }else {
                  // User found, redirect to Dashboard
                  navigate('/dashboard');
                  changeLoginStatus();
                }
        
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
                <Link to="/CreatePost">Create Post</Link>
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