import './pollList.css';
import Sidebar2 from './Sidebar2';
import PollPopup from './CreatePoll';
import { db, auth } from './firebaseConfig';
import React, { useEffect, useState } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { collection, query, where, getDocs, Timestamp, updateDoc, doc, getDoc } from 'firebase/firestore';

function PollsPage() {
  const [polls, setPolls] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [userProfilePictures, setUserProfilePictures] = useState({});

  const openPollPopup = () => { setShowPopup(true); };
  const ClosePollPopup = () => { setShowPopup(false); };

  const user = auth.currentUser;

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const now = Timestamp.now(); // Current time
        const pollQuery = query(
          collection(db, 'polls'),
          where('endTime', '>', now)
        );

        const querySnapshot = await getDocs(pollQuery);
        const pollList = [];

        const userProfilePictures = {}; // Store user profile pictures
        const userVotes = {}; // Store user votes

        // Fetch user votes
        const voteQuery = query(
          collection(db, 'votes'),
          where('userId', '==', user.uid)
        );
        for (const docSnapshot of querySnapshot.docs) {
          const pollData = docSnapshot.data();
          const ownerId = pollData.ownerId;
          const userDocRef = doc(db, 'users', ownerId); // Assuming you have a 'users' collection
          const userSnapshot = await getDoc(userDocRef);
          const userData = userSnapshot.data();

          if (userData && userData.profilePicture) {
            userProfilePictures[ownerId] = userData.profilePicture;
          }

          pollList.push({ id: docSnapshot.id, ...pollData });
          if (pollData.options) {
            const optionIndex = pollData.options.findIndex(
              (option) => option.voters && typeof option.voters === 'string' && option.voters.includes(user.email)
            );
            if (optionIndex !== -1) {
              userVotes[docSnapshot.id] = optionIndex;
            }
          }
        }
        setPolls(pollList);
        setUserProfilePictures(userProfilePictures);
        setSelectedOptions(userVotes);
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };
    fetchPolls();
  }, []);

  const voteForOption = async (pollId, optionIndex) => {
    if (selectedOptions[pollId] !== optionIndex) {
      try {
        const pollRef = doc(db, 'polls', pollId);
        const updatedOptions = [...polls.find((poll) => poll.id === pollId).options];

        // Decrease the vote count for the previously selected option
        if (selectedOptions[pollId] !== undefined) {
          updatedOptions[selectedOptions[pollId]].votes -= 1;
        }

        // Increase the vote count for the newly selected option
        updatedOptions[optionIndex].votes += 1;
        updatedOptions[optionIndex].voters += user.email + ",";
        // Calculate the new percentages for all options
        const totalVotes = updatedOptions.reduce((total, option) => total + option.votes, 0);
        updatedOptions.forEach((option) => {
          option.percentage = ((option.votes / totalVotes) * 100).toFixed(2);
        });

        await updateDoc(pollRef, {
          options: updatedOptions,
        });

        // Update the state to show the user's vote
        setSelectedOptions({
          ...selectedOptions,
          [pollId]: optionIndex,
        });
      } catch (error) {
        console.error('Error recording vote:', error);
      }
    }
  };

  return (
    <section className="main">
      <Sidebar2 />
      <div className="top-btn">
        <button className="modal-btn" onClick={openPollPopup}>Create Poll</button>
      </div>
      <div className="post-container">
        {showPopup && (
          <div className="modal">
            <div className="modal-content">
              <PollPopup onClose={ClosePollPopup} onPollCreated={ClosePollPopup} />
            </div>
          </div>
        )}
        <div className="wrapper">
          {polls.length === 0 ? (
            <alert>No polls available.</alert>
          ) : (
            polls.map((poll) => (
              <div key={poll.id} className='poll-area poll-container'>
                <div className="post-header">
                  <p className="user-icon">
                    {userProfilePictures[poll.ownerId] ? (
                      <img src={userProfilePictures[poll.ownerId]} alt="Owner Profile" className="profile-picture" />
                    ) :
                      (<FontAwesomeIcon icon={faUser} />)}
                  </p>
                  <div className="head">
                    <p className="username">{poll.ownerId}</p>
                  </div>
                </div>
                <header>{poll.question}</header>
                <ul>
                  {poll.options.map((option, optionIndex) => (
                    <li key={optionIndex}>
                      <input
                        type="radio"
                        name={`option-${poll.id}`}
                        onClick={() => voteForOption(poll.id, optionIndex)}
                        checked={selectedOptions[poll.id] === optionIndex}
                        disabled={selectedOptions[poll.id] !== undefined}
                      />
                      <span className="option-text">{option.text}</span>
                      {selectedOptions[poll.id] !== undefined && (
                        <div className="progress-bar">
                          <div
                            className="progress"
                            style={{ width: `${option.percentage}%` }}
                          >
                            <span className="percentage">{option.percentage}%</span>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default PollsPage;
