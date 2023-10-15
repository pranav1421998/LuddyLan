import React, { useState, useContext } from 'react';
import { db, auth } from './firebaseConfig';
import './CreatePoll.css';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

function PollPopup({ onClose, onPollCreated }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const user = auth.currentUser;

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const createPoll = async () => {
    try {
      if (!user) {
        console.error('User is not authenticated.');
        return;
      }

      const pollData = {
        question,
        options,
        ownerId: user.email,
      };

      const docRef = await addDoc(collection(db, 'polls'), pollData);
      console.log('Document written with ID: ', docRef.id);
      onPollCreated();
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  return (
    <div className="poll-popup">
      <div className="poll-content">
        <h2>Create a Poll</h2>
        <input
          type="text"
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="question-input" // Add a CSS class for question input
        />
        <h3>Options</h3>
        {options.map((option, index) => (
          <div key={index} className="option-container">
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="option-input" // Add a CSS class for options input
              
            /><span className='close-icon'
            onClick={()=>removeOption(index)}
            >&times;</span>
          </div>
        ))}
        <button onClick={addOption}>Add Option</button>
        <button onClick={createPoll}>Create Poll</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default PollPopup;
