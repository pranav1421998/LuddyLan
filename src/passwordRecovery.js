import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const PasswordRecovery = () => {
    const [email, setEmail] = useState('');
    const [question, setQuestion] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [error, setError] = useState('');
    const [showQuestion, setShowQuestion] = useState(false);

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
                // Proceed with sending OTP or other recovery steps
            } else {
                console.error('Incorrect answer!');
                setError('Incorrect answer!');
                setShowQuestion(false); // Hide question on incorrect answer
            }
        } else {
            console.error('No such user!');
            setError('No such user!');
        }
    };

    return (
        <form onSubmit={showQuestion ? handleRecovery : handleEmailSubmit}>
            {!showQuestion && (
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
            )}
            {showQuestion && (
                <>
                    <label>
                        {question}
                        <input type="text" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} />
                    </label>
                    <button type="submit">Submit</button>
                </>
            )}
            {error && <p>{error}</p>}
        </form>
    );
};

export default PasswordRecovery;
