import './Chat.css';
import { db, auth } from './firebaseConfig';
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp, updateDoc, doc, getDoc } from 'firebase/firestore';
import SidebarChat from './SidebarChat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp, faComment, faShare, faPaperPlaneTop, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useUser } from './UserContext';

function Chat() {

    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const user = useUser();
    const [chatMessages, setChatMessages] = useState(null);

    const handleUserSelect = (user) => {
        // Handle the selected user data
        setSelectedUser(user);
        fetchMessages();
      };

    const fetchMessages = async () => {
        if (selectedUser) {
          // Define the reference to the "chats" collection
          const chatsRef = collection(db, 'chats');
          
          // Create a query to check both user combinations
          const query1 = query(
            chatsRef,
            where('first_user', '==', user.email),
            where('second_user', '==', selectedUser.id)
          );
          
          const query2 = query(
            chatsRef,
            where('first_user', '==', selectedUser.id),
            where('second_user', '==', user.email)
          );
          
          // Combine the queries using logical OR (||)
          const combinedQuery = query1 || query2;
          
          try {
            const querySnapshot = await getDocs(combinedQuery);
            const messageData = [];
          
            querySnapshot.forEach(async (doc) => {
              // Get the reference to the nested "messages" collection
              const messagesRef = collection(doc.ref, 'messages');
              
              // Fetch messages from the nested collection
              const messagesSnapshot = await getDocs(messagesRef);
              
              messagesSnapshot.forEach((messageDoc) => {
                messageData.push({ id: messageDoc.id, ...messageDoc.data() });
              });
            });
          
            setMessages(messageData);
          } catch (error) {
            console.error('Error fetching messages:', error);
          }
        }
      };

    console.log(selectedUser);
    console.log(messages,'dddddddddddddddd');

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
  {selectedUser && messages.length > 0 && (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.id} className="message">
          {message.text}
        </div>
      ))}
    </div>
  )}
</div>

            </div>
        </div>
    );
}

export default Chat;