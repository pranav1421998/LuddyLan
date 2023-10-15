import React from "react";
import './GridCards.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { useUser } from './UserContext';
import { db } from "./firebaseConfig";

const GridCards = ({ data }) => {
    const user = useUser();

    const handleConnectClick = async (itemEmail, action) => {
        try {
            if (action === 'connect') {
                const friendsCollection = collection(db, 'friends');
                const newFriend = {
                    user_email: user.email, // Current user's email
                    follower_email: itemEmail, // Email of the user to connect with
                    is_accepted: false,
                };

                await addDoc(friendsCollection, newFriend);
                console.log('Friend added successfully');
                window.location.reload();
            } else if (action === 'unfollow') {
                console.log(user);
                console.log(itemEmail);
                // Query to find the specific document to delete
                const q = query(collection(db, 'friends'), where('user_email', '==', user.email), where('follower_email', '==', itemEmail));

                // Execute the query to get the document reference
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    console.log('Friend not found in the "friends" collection');
                } else {
                    // Delete the document
                    const friendDoc = doc(db, 'friends', querySnapshot.docs[0].id);
                    await deleteDoc(friendDoc);
                    console.log('Friend unfollowed successfully');
                    window.location.reload();
                }
            }
            else if (action === 'acceptRequest') {
                // Fetch the specific document
                const q = query(collection(db, 'friends'), where('user_email', '==', user.email), where('follower_email', '==', itemEmail));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Retrieve the first matching document
                    const friendDoc = querySnapshot.docs[0];
                    // Update the is_accepted value to true
                    await setDoc(friendDoc.ref, { is_accepted: true }, { merge: true });
                    console.log('Friend request accepted successfully');
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getIcons = (item) => {
        switch (item.condition) {
            case 'AllUsers':
                if (item.connected === 'following') {
                    return (
                        <button className="connect-button" disabled={true} style={{ backgroundColor: '#9b0303' }}>
                            Following
                        </button>
                    );
                } else if (item.connected === 'requested') {
                    return (
                        <button className="connect-button" style={{ backgroundColor: '#9b0303' }}>
                            Requested
                        </button>
                    );
                } else {
                    return (
                        <button className="connect-button" style={{ backgroundColor: '#9b0303' }} onClick={() => handleConnectClick(item.email, 'connect')}>
                            Connect
                        </button>
                    );
                }
            case 'FriendRequests':
                return (
                    <>
                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green', fontSize: '24px' }} onClick={() => handleConnectClick(item.email, 'acceptRequest')}/>
                        <FontAwesomeIcon icon={faTimesCircle} style={{ color: '#9b0303', fontSize: '24px' }} />
                    </>
                );
            case 'MyFriends':
                return (
                    <button className="connect-button" style={{ backgroundColor: '#9b0303' }} onClick={() => handleConnectClick(item.email, 'unfollow')}>
                        Unfollow
                    </button>
                );
            default:
                return null;
        }
    };

    return (
        <div className="grid-cards">
            {data.map((item, index) => (
                <div className="card" key={index}>
                    <div className="profile-picture">
                        {/* Display the profile picture */}
                    </div>
                    <p>{item.name}</p>
                    <div>
                        <a>{getIcons(item)}</a>
                        <span className="icon-gap"></span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GridCards;
