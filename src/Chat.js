import './Chat.css';
import { db, auth } from './firebaseConfig';
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs,  onSnapshot, orderBy, Timestamp, updateDoc, doc, getDoc } from 'firebase/firestore';
import SidebarChat from './SidebarChat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useUser } from './UserContext';

function Chat() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatDocId, setChatDocId] = useState(null);
    const currentUser = useUser(); // Your custom hook to get the current user's information


    useEffect(() => {
        // This effect will run when 'selectedUser' changes
        if (selectedUser) {
          fetchMessages();
        }
    
        // Cleanup listener on component unmount or when selected user changes
        return () => {
          if (chatDocId) {
            const messagesRef = collection(db, 'chats', chatDocId, 'messages');
            onSnapshot(messagesRef, () => {}); // Passing an empty function to unsubscribe
          }
        };
      }, [selectedUser]);
    
      async function fetchMessages() {
        if (currentUser && selectedUser) {
            console.log('Fetching messages between', currentUser.email, 'and', selectedUser.id);
            const currentUserEmail = currentUser.email;
            const selectedUserEmail = selectedUser.id;
        
            const chatsRef = collection(db, 'chats');
            // Query for chat documents where the 'users' array contains the current user's email
            const chatQuery = query(
            chatsRef,
            where('users', 'array-contains', currentUserEmail)
            );
        
            const querySnapshot = await getDocs(chatQuery);
            let chatDocRef = null;
        
            // Iterate over each document to find the one where 'users' includes both emails
            querySnapshot.forEach((doc) => {
            if (doc.data().users.includes(selectedUserEmail)) {
                chatDocRef = doc.ref;
                setChatDocId(doc.id); // Save the chat document ID if needed for later use
            }
            });
        
            if (chatDocRef) {
            // Listen to the 'messages' sub-collection of the found chat document
            const messagesRef = collection(chatDocRef, 'messages');
            const messagesQuery = query(messagesRef, orderBy('send_timestamp', 'asc'));
            const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
                const newMessages = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
                }));
                setMessages(newMessages);
            });
        
            // You'll need to manage the unsubscribe function to stop listening to updates when needed
            return unsubscribe;
            }
        }
        else{
            // console.log('currentUser or selectedUser is null', currentUser, selectedUser);
        }
      }

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        fetchMessages();
    };

    // console.log(selectedUser,"selectedddd");
    // console.log(currentUser,"currenttttt");
    // console.log(messages, 'dddddddddddddddd');

    return (
        <div>
            <SidebarChat onUserSelect={handleUserSelect}></SidebarChat>
            <div className='modal-container'>
                <div className="component">
                    <div className='title'>
                        <div className="chat-input">
                            <input type="text" placeholder="Type your message..." />
                            <button>Search</button>
                        </div>
                        <h2>My Friends</h2>
                    </div>
                    <div>
                    </div>
                </div>
                <div className='chat-container'>
                    <h1>chat</h1>
                    {selectedUser && <p>{selectedUser.firstName}</p>}
                    <div className="chat-input-bar">
                        <input type="text" placeholder="Type your message..." className='input-chat' />
                        <FontAwesomeIcon icon={faArrowCircleRight} className="fa-2x" />
                    </div>
                    <div className="chat-messages">
                        {messages.map((message) => (
                            <div key={message.id} className={message.sender_email === currentUser.email ? "my-message" : "their-message"}>
                            {message.sender_email} {message.message_content} 
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Chat;