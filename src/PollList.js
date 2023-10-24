import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

function PollList({ user }) {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      const pollQuery = query(collection(db, 'polls'), where('endTime', '>=', Timestamp.now()));
      const pollSnapshot = await getDocs(pollQuery);

      const pollData = [];
      pollSnapshot.forEach((doc) => {
        pollData.push({ id: doc.id, ...doc.data() });
      });

      setPolls(pollData);
    };

    fetchPolls();
  }, []);

  const hasEndTimePassed = (endTime) => {
    const currentTime = Timestamp.now().toDate();
    return currentTime > endTime.toDate();
  };

  const voteForOption = async (pollId, option) => {
    if (!user) {
      alert('Please sign in to vote.');
      return;
    }

    const pollRef = doc(db, 'polls', pollId);

    // Check if the user has already voted
    if (pollRef.data().voters && pollRef.data().voters.includes(user.uid)) {
      alert('You have already voted in this poll.');
      return;
    }

    // Update the poll with the user's vote
    await updateDoc(pollRef, {
      options: { [option]: arrayUnion(user.uid) },
      voters: arrayUnion(user.uid),
    });
  };

  return (
    <div>
      <h2>Polls</h2>
      {polls.map((poll) => (
        <div key={poll.id}>
          <h3>{poll.question}</h3>
          <p>End Time: {poll.endTime.toDate().toLocaleString()}</p>
          {hasEndTimePassed(poll.endTime) ? (
            <p>Poll has ended.</p>
          ) : (
            <div>
              <h4>Options:</h4>
              {poll.options.map((option, index) => (
                <div key={index}>
                  <label>
                    <input type="radio" name={`poll${poll.id}`} onChange={() => voteForOption(poll.id, index)} />
                    {option} - Votes: {option.length}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PollList;
