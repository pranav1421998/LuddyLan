import React, { useState, useEffect } from 'react';
import './SidebarChat.css';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { useUser } from './UserContext';
import { auth, db, storage } from "./firebaseConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import defimg from './Images/user.jpg';

const SidebarChat = ({ onUserSelect }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('/friendRequests');
  const [userdata, setDocuments] = useState([]); // State to store user data
  const user = useUser();
  const [selectedItem, setSelectedItem] = useState(null); // State to keep track of the selected item



  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const usersRef = collection(db, 'users');
            const userSnapshot = await getDocs(usersRef);
            const userDataArray = [];

            userSnapshot.docs.forEach(doc => {
                if (doc.id !== user.email) { 
                    userDataArray.push({id:doc.id, ...doc.data()});
                }
            });

            setDocuments(userDataArray);
        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    };

    fetchData();
}, [user]);

const handleUserSelect = (user) => {
    console.log(user);
    setSelectedItem(user.id);
    // Pass the selected user data to the parent component (Chat.js)
    onUserSelect(user);
  };

  return (
    <div className="sidebar-chat-container">
      <Sidebar>
        <Menu>
        <div className='chat-user'>
            {userdata.map((user) => (
              <MenuItem  key={user.id} onClick={() => handleUserSelect(user)}
              className={selectedItem === user.id ? "selected-item" : ""} >
                <div className='chat-user-container'>
                  <img src={user.profilePicture || defimg} alt="Profile" className="chat-profile-picture" />
                  <div className="user-name">
                    {user.firstName + ' ' + user.lastName}
                  </div>
                </div>
              </MenuItem>
            ))}
          </div>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarChat;
