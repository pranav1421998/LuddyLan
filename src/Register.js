import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';





export const Register = () => {
    const auth = getAuth();
    const db = getFirestore();

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [byear, setByear] = useState('');
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [secQues, setSecQues] = useState('');
    const [secAns, setSecAns] = useState('');

    const navigate = useNavigate();  
    const [loading, setLoading] = useState(false);

    
    const handleSubmit = async (e) => { // <-- Mark handleSubmit as async
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass); // <-- use await here
            console.log('User registered:', userCredential.user);
            setError('Registered, Redirecting to login page...');
            setLoading(true); // Set loading to true to show loading indicator
    
            // Add user details to Firestore
            const userDocRef = doc(db, "users", email); // using email as the document ID
            await setDoc(userDocRef, { // <-- use await here
                firstName: first,
                lastName: last,
                birthYear: byear,
                phone: phone,
                securityQuestion: secQues,
                securityAnswer: secAns
            });
    
            setTimeout(() => {
                setLoading(false); // Set loading to false before navigation
                navigate('/'); // navigate the user to the login page after 5s
            }, 5000);
        } catch (error) {
            // Handle all errors here
            if (error.code === 'auth/email-already-in-use') {
                console.error('Email already in use:', error);
                setError('This email address is already in use. Please use a different email address or sign in.');
            } else {
                console.error('Error registering user:', error);
                setError('Error registering user. Please try again.');
            }
        }
    };

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
                <label htmlFor="first">First name: 
                <input value={first} onChange={(e) => setFirst(e.target.value)}type="first" placeholder="first" id="first" name="first" />
                </label>
                <label htmlFor="last">Last name: 
                <input value={last} onChange={(e) => setLast(e.target.value)}type="last" placeholder="last" id="last" name="last" />
                </label>
                <label htmlFor="byear">Birth year: 
                <input value={byear} onChange={(e) => setByear(e.target.value)}type="byear" placeholder="1990" id="byear" name="byear" />
                </label>
                <label htmlFor="phone">Phone: 
                <input value={phone} onChange={(e) => setPhone(e.target.value)}type="phone" placeholder="5556667777" id="phone" name="phone" />
                </label>
                <label htmlFor="secQues">Security Question: 
                <input value={secQues} onChange={(e) => setSecQues(e.target.value)}type="secQues" placeholder="Type security question" id="secQues" name="secQues" />
                </label>
                <label htmlFor="secAns">Security Answer: 
                <input value={secAns} onChange={(e) => setSecAns(e.target.value)}type="secAns" placeholder="Type answer" id="secAns" name="secAns" />
                </label>
                <button type="submit" onClick={handleSubmit}>Create Account</button>
            </form>
            <button className="link-btn" onClick={() => navigate("/")}>Already have an account? Login.</button>
            
            
            <div>
                {loading && <p>Loading...</p>}
                {error && <p style={{color: 'red'}}>{error}</p>}
            </div>
        </div>

    );
};