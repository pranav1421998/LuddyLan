import React, { useState, useContext } from 'react';
import { db, auth } from './firebaseConfig';
import './CreatePoll.css';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

function PollPopup({ onClose, onPollCreated }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [endTime, setEndTime] = useState(''); // New state for poll end time

  const user = auth.currentUser;

  const addOption = () => { setOptions([...options, '']); };

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
      const endTimeDate = new Date(endTime);
      // Create a Firestore Timestamp from the JavaScript Date
      const endTimeTimestamp = Timestamp.fromDate(endTimeDate);
      // Initialize votes and percentages to 0 for each option
      const initializedOptions = options.map((option) => ({
        text: option,
        votes: 0,
        percentage: 0,
        voters:[],
      }));

      const pollData = {
        question,
        options: initializedOptions, // Use initialized options
        ownerId: user.email,
        endTime: endTimeTimestamp,
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
          className="question-input"
        />
        <h3>Options</h3>
        {options.map((option, index) => (
          <div key={index} className="option-container">
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="option-input"
            />
            <span className='close-icon' onClick={() => removeOption(index)}>&times;</span>
          </div>
        ))}
        <label>End Time: </label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        /><br></br>
        <button onClick={addOption}>Add Option</button>
        <button onClick={createPoll}>Create Poll</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default PollPopup;
