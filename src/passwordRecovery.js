import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";


const PasswordRecovery = () => {
    const [email, setEmail] = useState('');
    const [question, setQuestion] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [error, setError] = useState('');
    const [showQuestion, setShowQuestion] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    
    //for OTP
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);

    //OTP helper fns
    const sendOtp = () => {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
        setGeneratedOtp(newOtp);

        emailjs.send('service_luddy_lan', 'otp_luddy_lan', {
            to_email: email,
            otp: newOtp,
        }, 'L5OVU6Hn9qa30LmKh')
        .then((result) => {
            console.log(result.text);
            setShowOtpInput(true); // Show OTP input after sending email
        }, (error) => {
            console.log(error.text);
            setError('Failed to send OTP. Please try again.');
        });
    };

    const verifyOtp = () => {
        if (otp === generatedOtp) {
            console.log('OTP verified!');
    
            const auth = getAuth();
            
            sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log('Password reset email sent!');
                setError('Password reset email sent');
                setLoading(true); // Set loading to true to show loading indicator
                setTimeout(() => {
                    setLoading(false); // Set loading to false before navigation
                    navigate('/'); // navigate the user to the login page after 5s
                }, 5000);
                
            })
            .catch((error) => {
                console.error('Error sending password reset email:', error);
                setError('Error sending password reset email. Please try again.');
            });
            
        } else {
            console.error('Incorrect OTP!');
            setError('Incorrect OTP!');
        }
    };




    const fetchQuestion = async () => {
        try {
            const db = getFirestore();
            const userDoc = await getDoc(doc(db, 'users', email));
            if (userDoc.exists()) {
                setQuestion(userDoc.data().securityQuestion);
                setShowQuestion(true); // Show security question after fetching
            } else {
                console.error('No such user!');
                setError('No such user!');
            }
        } catch (error) {
            console.error('Error fetching security question:', error);
            setError('Error fetching security question.');
        }
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        fetchQuestion(); // Fetch question on email submit
    };

    const handleRecovery = async (e) => {
        e.preventDefault();
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', email));
        if (userDoc.exists()) {
            const correctAnswer = userDoc.data().securityAnswer;
            if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
                console.log('Correct answer!');
                sendOtp();
            } else {
                console.error('Incorrect answer!');
                setError('Incorrect answer!');
                setShowQuestion(false); // Hide question on incorrect answer
            }
        } else {
            console.error('No such user!');
            setError('No such user!');}
        }

        return (
            <form onSubmit={(e) => {
                e.preventDefault();
                if (showOtpInput) {
                    verifyOtp();
                } else if (showQuestion) {
                    handleRecovery(e);
                } else {
                    handleEmailSubmit(e);
                }
            }}>
                {!showQuestion && !showOtpInput && (
                    <div>
                        <label>
                            Email:
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        <button type="submit">Submit</button>
                    </div>
                )}
                {showQuestion && !showOtpInput && (
                    <div>
                        <label>
                            {question}
                            <input type="text" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} />
                        </label>
                        <button type="submit">Submit</button>
                    </div>
                )}
                {showOtpInput && (
                    <div>
                        <label>
                            Enter OTP:
                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
                        </label>
                        <button type="submit">Verify OTP</button>
                    </div>
                )}
                {error && <p>{error}</p>}
            </form>
        );
        
};

export default PasswordRecovery;
