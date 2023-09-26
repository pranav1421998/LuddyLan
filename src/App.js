import { getAuth, onAuthStateChanged } from "firebase/auth";
import React from 'react';
import { Register } from './Register.js';

function App() {
    const auth = getAuth();  // Initialize the auth instance

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            console.log("(From APP)User signed in:", user.displayName);
        } else {
            // User is signed out
            console.log("(From app )User is signed out.");
        }
    });

    return (
        <div className="App">
            <header className="App-header">
                <Register></Register>
            </header>
        </div>
    );
}

export default App;