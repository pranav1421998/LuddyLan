import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export const Register = () => {
    const auth = getAuth();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [byear, setByear] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

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
        <div className="register-container">
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="email">New email:</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="username@iu.edu" id="email" name="Email" />
                <label htmlFor="password">New password:</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="Password" />
                
                <label>Please fill out some basic info:</label>
                <label htmlFor="byear">Birth Year: 
                <input value={byear} onChange={(e) => setByear(e.target.value)}type="byear" placeholder="1990" id="byear" name="byer" />
                </label>
        
                <button type="submit" onClick={handleSubmit}>Create Account</button>
            </form>
            <button className="link-btn" onClick={() => navigate("/")}>Already have an account? Login.</button>
        </div>
    );
};