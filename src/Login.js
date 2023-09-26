import firebase from "firebase/app";
import "firebase/auth";

import React from "react";


const Login = () => {
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
      <div className="login-container">
          <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
  );
};

export default Login;