import './Chat.css';
import { db, auth } from './firebaseConfig';
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs,  onSnapshot, orderBy, Timestamp, updateDoc, doc, getDoc, addDoc } from 'firebase/firestore';
import SidebarChat from './SidebarChat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faComments } from '@fortawesome/free-solid-svg-icons';
import { useUser } from './UserContext';
import Cookies from 'js-cookie';
import { debounce } from 'lodash'; // You can install lodash if not already: npm install lodash
import { faEye } from '@fortawesome/free-solid-svg-icons';
import {
    serverTimestamp,
  } from 'firebase/firestore';

function Chat() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatDocId, setChatDocId] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const currentUser = useUser();
    const [isTyping, setIsTyping] = useState(false);

    const userDet = Cookies.get('userDetails');
    var userObj = JSON.parse(userDet);
    var user_email = userObj.email;
    ////////////////////////////////  for read receipts and typing.... ////////////

        // Debounce function to handle typing status
        const handleStopTyping = debounce(() => {
            handleTyping(false);
        }, 5000); // display typing for 5 seconds after stopping typing
    
        const handleInputChange = (e) => {
            setMessageInput(e.target.value);
            handleTyping(true);
            handleStopTyping();
        };


        const markMessagesAsRead = async () => {
            if (chatDocId && selectedUser && selectedUser.email !== user_email) {
                const messagesRef = collection(db, 'chats', chatDocId, 'messages');
                const querySnapshot = await getDocs(messagesRef);
                
                querySnapshot.forEach(async (docSnapshot) => {
                    if (!docSnapshot.data().read && docSnapshot.data().sender_email !== user_email) {
                        await updateDoc(docSnapshot.ref, {
                            read: true
                        });
                    }
                });
            }
        };
    
    // Call this function when a user selects a chat or when the component mounts with a selected chat
    useEffect(() => {
        if (selectedUser) {
            markMessagesAsRead();
        }
    }, [selectedUser]);

    const handleTyping = (isTyping) => {
        const chatRef = doc(db, 'chats', chatDocId);
        updateDoc(chatRef, {
            typingUser: isTyping ? user_email : null
        });
    };
    
    // Implement a debounce mechanism to call handleTyping(false) when the user stops typing

    useEffect(() => {
        if (chatDocId) {
            const chatRef = doc(db, 'chats', chatDocId);
            const unsubscribe = onSnapshot(chatRef, (doc) => {
                if (doc.exists()) {
                    const chatData = doc.data();
                    setIsTyping(chatData.typingUser && chatData.typingUser !== user_email);
                }
            });
            return unsubscribe;
        }
    }, [chatDocId,user_email]);

        // Function to render a message
            const renderMessage = (message, index) => {
            const isLastMessage = index === messages.findIndex((msg, idx) => {
                return msg.sender_email === user_email && idx > index;
            });
        
            return (
                <div key={message.id} className={message.sender_email === user_email ? "my-message" : "their-message"}>
                    <div className='chat-content'>
                        <p className='para-color'>{message.message_content}</p>
                        <small className='time-stamp'>{message?.send_timestamp && renderTimestamp(message.send_timestamp)}</small>
                        {message.read && <small className='read-receipt'><FontAwesomeIcon icon={faEye} /></small>}
                    </div>
                </div>
            );
        };
        
    
/////////////////////////////////////////////////////////////////////////////////////////////////////    

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
      }, [selectedUser,chatDocId]);

      useEffect(() => {
        // Scroll to the bottom of the chat whenever the messages change
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]); // This will trigger every time the 'messages' state changes
    
    
      async function fetchMessages(selectedUser) {
        if (user_email && selectedUser) {
            console.log('Fetching messages between', user_email, 'and', selectedUser.id);
            const selectedUserEmail = selectedUser.id;
    
            const chatsRef = collection(db, 'chats');
            const chatQuery = query(
                chatsRef,
                where('users', 'array-contains', user_email)
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
        if (user_email && selectedUser) {
            const selectedUserEmail = selectedUser.id;
    
            // Find the chat document
            const chatsRef = collection(db, 'chats');
            const chatQuery = query(
                chatsRef,
                where('users', 'array-contains', user_email)
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
                    users: [user_email, selectedUserEmail],
                    // Add any other fields you need
                });
    
                chatDocRef = newChatDocRef;
            }
    
            // Add the message to the messages collection
            const messagesRef = collection(chatDocRef, 'messages');
    
            await addDoc(messagesRef, {
                sender_email: user_email,
                sender_name: currentUser.displayName,
                send_timestamp: serverTimestamp(),
                message_content: messageContent,
                read: false, // Initial value when the message is sent
            });

            handleTyping(false); // User stops typing when a message is sent
        }
        fetchMessages(selectedUser);
    };
    
    const renderTimestamp = (timestamp) => {
        const date = new Date(timestamp.toMillis());
        const hours = date.getHours() % 12 || 12; // Ensure 12-hour format
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'AM' : 'PM';
        const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
        return formattedTime;
    };

    return (
    <div>
        <SidebarChat onUserSelect={handleUserSelect}></SidebarChat>
        <div className='modal-container'>
            <div className="user-title">
                {selectedUser && <h3>{selectedUser.firstName + ' ' + selectedUser.lastName}</h3>}
                {isTyping && <div className="typing-indicator">Typing...</div>}
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
                            {messages.map((message,index) => renderMessage(message, index))}
                           

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
                        onChange={handleInputChange} // Updated to handleInputChange}
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