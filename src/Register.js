import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export const Register = () => {
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
        <div className="register-container">
            <button onClick={handleGoogleSignIn}>Sign in with Google</button>
            <h6>Already have an account? <button onClick={() => {
                // Handle traditional email/password login
            }}>Login</button></h6>
        </div>
    );
};