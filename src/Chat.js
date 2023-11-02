import './Chat.css';
import { db, auth } from './firebaseConfig';
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp, updateDoc, doc, getDoc } from 'firebase/firestore';

function Chat() {


return (
    <div className="chat-container">
        <div className="chat-messages">
            {/* Chat messages go here */}
        </div>
        <div className="chat-input">
            <input type="text" placeholder="Type your message..." />
            <button>Send</button>
        </div>
    </div>
);
}

export default Chat;