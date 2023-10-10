// Register
import React, { useState, useEffect } from "react";
import { useNavigate , useLocation} from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import './Register.css';

export const Register = () => {
    const auth = getAuth();
    const db = getFirestore();

    //variable for the form
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [byear, setByear] = useState('');
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [phone, setPhone] = useState('');
    const [secQues, setSecQues] = useState('');
    const [secAns, setSecAns] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passError, setPassError] = useState('');
    const [confirmPassError, setConfirmPassError] = useState('');
    const [loading, setLoading] = useState(false);

    // Define an array of security questions
    const securityQuestions = [
        "Where were you born?",
        "What was the first exam you failed?",
        "What is your favorite food?",
        "What color do you like the most?",
        "What is your favorite sport?"
    ];

    //helper varibles to check if the user comes from the register button or google auth
    const [isEmailReadOnly, setIsEmailReadOnly] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();  

    const handleEmailChange = (e) => {
        //not settable if user came from google auth
        //if (!isEmailReadOnly) {
            const value = e.target.value;
            setEmail(value);

            // Check if email is empty or doesn't end with 'iu.edu'
            if (!value || !value.endsWith('iu.edu')) {
                setEmailError('Please enter a valid IU email address.');
            } else { setEmailError('');}
       // }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPass(value);

        // Check if password meets constraints
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-]).{8,}$/;
        if (!passwordRegex.test(value)) {
            setPassError('Password must be at least 8 characters long.\nShould include: A upper case letter, A special character.');
        } else {
            setPassError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPass(value);

        // Check if passwords match
        if (value !== pass) {
            setConfirmPassError('Passwords do not match.');
        } else {
            setConfirmPassError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if any required fields are empty
        if(!email.endsWith('iu.edu')){
            setEmailError('Should be an IU email')
        }
        else if (
            !email ||
            !pass ||
            !confirmPass ||
            !first ||
            !last ||
            !secQues ||
            !secAns
        ) {
            setEmailError('Please fill out all required fields correctly.');
            window.scrollTo(0, 0);
            return;
        }
    
        // Check if passwords match
        if (pass !== confirmPass) {
            setConfirmPassError('Passwords do not match.');
            window.scrollTo(0, 0);
            return;
        }
    
        // Check password constraints
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-]).{8,}$/;
        if (!passwordRegex.test(pass)) {
            setPassError('Password must be at least 8 characters long, include a capital letter, and a special character.');
            window.scrollTo(0, 0);
            return;
        }
    
        try {
            //create authentication entry only when not using google auth
            if(!(isEmailReadOnly)){const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            console.log('User registered:', userCredential.user);}

            setLoading(true);
            const userDocRef = doc(db, "users", email);
            await setDoc(userDocRef, {
                firstName: first,
                lastName: last,
                birthYear: byear,
                phone: phone,
                securityQuestion: secQues,
                securityAnswer: secAns
            });
    
            setTimeout(() => {
                setLoading(false);
                navigate('/');
            }, 5000);
        } catch (error) {
            
                if (error.code === 'auth/email-already-in-use') {
                    console.error('Email already in use:', error);
                    setEmailError('This email address is already in use. Please use a different email address or sign in.');
                } else {
                    console.error('Error registering user:', error);
                    setEmailError('Error registering user. Please try again.');
                }
        }
    };
    
    useEffect(() => {
        // Extract email from location state and set it to the email state
        if (location && location.state && location.state.email) {
          setEmail(location.state.email);
          setIsEmailReadOnly(true); // Set email input to read-only since email was passed
        } else {
          setIsEmailReadOnly(false); // Allow email input to be editable since no email was passed
        }
      }, [location]);

    return (
        <div className="background-container">
        <div className="auth-form-container">
            <h2>REGISTER</h2>
            <div>
                {loading && <p>Loading...</p>}
            </div>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="email">IU Email*:</label>
                <input 
                    value={email} 
                    onChange={handleEmailChange}
                    type="email" 
                    placeholder="username@iu.edu" 
                    id="email" 
                    name="Email" 
                    readOnly={isEmailReadOnly}//conditional readonly    
                />
                {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
                
                <label htmlFor="password">New password*:</label>
                <input 
                    value={pass} 
                    onChange={handlePasswordChange}
                    type="password" 
                    placeholder="********" 
                    id="password" 
                    name="Password" 
                />
                {passError && <p style={{ color: 'red' }}>{passError}</p>}

                <label htmlFor="confirmPass">Confirm Password*:</label>
                <input 
                    value={confirmPass} 
                    onChange={handleConfirmPasswordChange}
                    type="password" 
                    placeholder="********" 
                    id="confirmPass" 
                    name="ConfirmPassword" 
                />
                {confirmPassError && <p style={{ color: 'red' }}>{confirmPassError}</p>}

                <label htmlFor="first">First name*:</label>
                <input value={first} onChange={(e) => setFirst(e.target.value)} type="text" placeholder="First Name" id="first" name="first" />
                <label htmlFor="last">Last name*:</label>
                <input value={last} onChange={(e) => setLast(e.target.value)} type="text" placeholder="Last Name" id="last" name="last" />
                <label htmlFor="byear">Birth year:</label>
                <input value={byear} onChange={(e) => setByear(e.target.value)} type="text" placeholder="xxxx" id="byear" name="byear" />
                <label htmlFor="phone">Phone:</label>
                <input
                    value={phone}
                    onChange={(e) => {
                        const value = e.target.value;
                        // Use a regular expression to match and extract digits
                        const digitsOnly = value.replace(/\D/g, '');
                        // Ensure the phone number has exactly 10 digits
                        if (digitsOnly.length === 10) {
                            // Split the digits into groups of three and add hyphens
                            const formattedValue = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
                            setPhone(formattedValue);
                        } else {
                            // If the input doesn't have 10 digits, set the value as is (no formatting)
                            setPhone(value);
                        }
                    }}
                    type="text"
                    placeholder="xxx-xxx-xxxx"
                    id="phone"
                    name="phone"
                    pattern="[0-9-]{12}"
                    maxLength="12"
                />
                {/* Dropdown for Security Questions */}
                <label htmlFor="secQues">Security Question*:</label>
                <select value={secQues} onChange={(e) => setSecQues(e.target.value)} id="secQues" name="secQues">
                    <option value="">Select a security question</option>
                    {securityQuestions.map((question, index) => (
                        <option key={index} value={question}>{question}</option>
                    ))}
                </select>

                <label htmlFor="secAns">Security Answer*:</label>
                <input value={secAns} onChange={(e) => setSecAns(e.target.value)} type="text" placeholder="Type answer" id="secAns" name="secAns" />
                <button type="submit">Create Account</button>
            </form>
            <button className="link-btn" onClick={() => navigate("/")}>Already have an account? Login.</button>
        </div>
        </div>
    );
};

