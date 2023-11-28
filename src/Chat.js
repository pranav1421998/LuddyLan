import './Chat.css';
import { db, auth } from './firebaseConfig';
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs,  onSnapshot, orderBy, Timestamp, updateDoc, doc, getDoc, addDoc } from 'firebase/firestore';
import SidebarChat from './SidebarChat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faComments } from '@fortawesome/free-solid-svg-icons';
import { useUser } from './UserContext';
import {
    serverTimestamp,
  } from 'firebase/firestore';

function Chat() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatDocId, setChatDocId] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const currentUser = useUser();

    useEffect(() => {
        if (selectedUser) {
          fetchMessages();
        }
    
        return () => {
          if (chatDocId) {
            const messagesRef = collection(db, 'chats', chatDocId, 'messages');
            onSnapshot(messagesRef, () => {});
          }
        };
      }, [selectedUser]);

      useEffect(() => {
        // Scroll to the bottom of the chat whenever the messages change
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]); // This will trigger every time the 'messages' state changes
    
    
      async function fetchMessages(selectedUser) {
        if (currentUser && selectedUser) {
            console.log('Fetching messages between', currentUser.email, 'and', selectedUser.id);
            const currentUserEmail = currentUser.email;
            const selectedUserEmail = selectedUser.id;
    
            const chatsRef = collection(db, 'chats');
            const chatQuery = query(
                chatsRef,
                where('users', 'array-contains', currentUserEmail)
            );
    
            const querySnapshot = await getDocs(chatQuery);
            let chatDocRef = null;
    
            querySnapshot.forEach((doc) => {
                if (doc.data().users.includes(selectedUserEmail)) {
                    chatDocRef = doc.ref;
                    setChatDocId(doc.id);
                }
            });
    
            if (chatDocRef) {
                const messagesRef = collection(chatDocRef, 'messages');
                const messagesQuery = query(messagesRef, orderBy('send_timestamp', 'asc'));
                const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
                    const newMessages = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setMessages(newMessages);
                });
    
                return unsubscribe;
            }
        }
        else{
        }
      }

      const handleUserSelect = (user) => {
        // Clear existing messages
        setMessages([]);
        // Set the selected user
        setSelectedUser(user);
        // Fetch messages for the selected user
        fetchMessages(user);
    };

    const handleSendMessage = async (messageContent) => {
        if (currentUser && selectedUser) {
            const currentUserEmail = currentUser.email;
            const selectedUserEmail = selectedUser.id;
    
            // Find the chat document
            const chatsRef = collection(db, 'chats');
            const chatQuery = query(
                chatsRef,
                where('users', 'array-contains', currentUserEmail)
            );
    
            const querySnapshot = await getDocs(chatQuery);
            let chatDocRef = null;
    
            // Check if a chat document already exists
            querySnapshot.forEach((doc) => {
                if (doc.data().users.includes(selectedUserEmail)) {
                    chatDocRef = doc.ref;
                }
            });
    
            // If no chat document exists, create a new one
            if (!chatDocRef) {
                const newChatDocRef = await addDoc(chatsRef, {
                    users: [currentUserEmail, selectedUserEmail],
                    // Add any other fields you need
                });
    
                chatDocRef = newChatDocRef;
            }
    
            // Add the message to the messages collection
            const messagesRef = collection(chatDocRef, 'messages');
    
            await addDoc(messagesRef, {
                sender_email: currentUser.email,
                sender_name: currentUser.displayName,
                send_timestamp: serverTimestamp(),
                message_content: messageContent,
            });
        }
        fetchMessages(selectedUser);
    };
    
    const renderTimestamp = (timestamp) => {
        const date = new Date(timestamp.toMillis());
        const hours = date.getHours() % 12 || 12; // Ensure 12-hour format
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
        return formattedTime;
    };

    return (
    <div>
        <SidebarChat onUserSelect={handleUserSelect}></SidebarChat>
        <div className='modal-container'>
            <div className="user-title">
                {selectedUser && <h3>{selectedUser.firstName + ' ' + selectedUser.lastName}</h3>}
            </div>

            <div className='chat-container'>
                {!selectedUser ? (
                    <div className="no-user-selected-message">
                        <h1>Chat</h1>
                        <div className='comments-icon'>
                            <FontAwesomeIcon icon={faComments} /> 
                        </div>
                        <h3 className='chat-msg'>Click on a user to start a chat</h3>
                    </div>
                ) : (
                    <div className='chat-section'>
                        <div className="chat-messages">
                            {messages.map((message) => (
                                <div key={message.id} className={message.sender_email === currentUser.email ? "my-message" : "their-message"}>
                                    <div className='chat-content'>
                                        <p className='para-color'>{message.message_content}</p>
                                        <small className='time-stamp'>{message?.send_timestamp && renderTimestamp(message.send_timestamp)}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {selectedUser && (
                <div className="fixed-chat-input-bar">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className='input-chat'
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && messageInput.trim()) {
                                handleSendMessage(messageInput.trim());
                                setMessageInput('');
                            }
                        }}
                    />
                    <FontAwesomeIcon
                        icon={faArrowCircleRight}
                        className="fa-2x"
                        onClick={() => {
                            handleSendMessage(messageInput.trim());
                            setMessageInput('');
                        }}
                    />
                </div>
            )}
        </div>
    </div>
);

    
    
}

export default Chat;