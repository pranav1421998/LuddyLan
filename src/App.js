import { getAuth, onAuthStateChanged } from "firebase/auth";
import  {Register} from './Register.js';
import React, { useState } from "react";
import './App.css';
import Login from './Login.js';
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
            console.log("(From APP)User signed in:", user.displayName);
        } else {
            // User is signed out
            console.log("(From app )User is signed out.");
        }
    });
   
    return (
        <div className="App">
 <div className="App">
    <Navbar />
    {/* The rest of your application */}
    </div>
      {
       currentForm === "login" ? <Login onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm} />
      }
    </div>
    );
}

export default App;