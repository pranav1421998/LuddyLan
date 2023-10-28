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
                    user_email: user.email,
                    follower_email: itemEmail,
                    is_accepted: false,
                };

                await addDoc(friendsCollection, newFriend);
                console.log('Friend added successfully');
                window.location.reload();
            } else if (action === 'unfollow') {
                console.log(user);
                console.log(itemEmail);
                const userDocRef = doc(db, 'users', user.email);
                const friendsCollectionRef = collection(userDocRef, 'Friends');
                const friendDocRef = doc(friendsCollectionRef, itemEmail); // Replace itemEmail with the specific email you want to remove
                try {
                    await deleteDoc(friendDocRef);
                    console.log(`Successfully unfollowed user with email: ${itemEmail}`);
                } catch (error) {
                    console.error(`Error unfollowing user with email ${itemEmail}:`, error);
                }
                const userDocumentRef = doc(db, 'users', itemEmail);
                const friendsCollRef = collection(userDocumentRef, 'Friends');
                const friendDocumentRef = doc(friendsCollRef, user.email); // Replace itemEmail with the specific email you want to remove
                try {
                    await deleteDoc(friendDocumentRef);
                    console.log(`Successfully unfollowed user with email: ${user.email}`);
                } catch (error) {
                    console.error(`Error unfollowing user with email ${user.email}:`, error);
                }    
            
            }
            else if (action === 'acceptRequest') {
                const userDocRef = doc(db, 'users', user.email);
                const friendData = {
                is_accepted: true,
                };
                const friendsCollectionRef = collection(userDocRef, 'Friends');
                const friendDocRef = doc(friendsCollectionRef, itemEmail);
                await setDoc(friendDocRef, friendData);
                console.log('Friend added successfully');

                const userDocumentRef = doc(db, 'users', itemEmail);
                const friendDataDoc = {
                is_accepted: true,
                };
                const friendsColRef = collection(userDocumentRef, 'Friends');
                const friendDocumentRef = doc(friendsColRef, user.email);
                await setDoc(friendDocumentRef, friendDataDoc);
                console.log('Friend added successfully');

                const userDocuRef = doc(db, 'users', user.email);
                const requestsCollRef = collection(userDocuRef, 'Requests');
                const reqDocRef = doc(requestsCollRef, itemEmail); // Replace itemEmail with the specific email you want to remove
                try {
                    await deleteDoc(reqDocRef);
                    console.log(`Successfully removed user with email: ${itemEmail}`);
                    window.location.reload();
                } catch (error) {
                    console.error(`Error removed user with email ${itemEmail}:`, error);
                }
            }
            else if (action === 'declineRequest') {
                
                const userDocuRef = doc(db, 'users', user.email);
                const requestsCollRef = collection(userDocuRef, 'Requests');
                const reqDocRef = doc(requestsCollRef, itemEmail); // Replace itemEmail with the specific email you want to remove
                try {
                    await deleteDoc(reqDocRef);
                    console.log(`Successfully removed user with email: ${itemEmail}`);
                    window.location.reload();
                } catch (error) {
                    console.error(`Error removed user with email ${itemEmail}:`, error);
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
                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green', fontSize: '24px', cursor:"pointer" }} onClick={() => handleConnectClick(item.email, 'acceptRequest')}/>
                        <FontAwesomeIcon icon={faTimesCircle} style={{ color: '#9b0303', fontSize: '24px', cursor:"pointer" }} onClick={() => handleConnectClick(item.email, 'declineRequest')} />
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
                    {item.profilePicture && (
                    <img className="profile-picture" src={item.profilePicture} alt="User Profile Picture" />
                    )}
                    </div>
                    <p className="p-color">{item.name}</p>
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
