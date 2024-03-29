import React, { useState, useEffect } from 'react';
import './SidebarChat.css';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { useUser } from './UserContext';
import { db } from "./firebaseConfig";
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
        if (!user) {
          console.log("User is not logged in");
          return; // Exit the function if there is no user logged in
        }
        const usersRef = collection(db, 'users');
        const userSnapshot = await getDocs(usersRef);
        const userDataArray = [];
  
        userSnapshot.docs.forEach(doc => {
          if (doc.id !== user.email) { // Make sure 'user' is not null
            userDataArray.push({ id: doc.id, ...doc.data() });
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
    //console.log(user);
    setSelectedItem(user.id);
    // Pass the selected user data to the parent component (Chat.js)
    onUserSelect(user);
  };

  return (
    <div className="sidebar-chat-container">
      <Sidebar backgroundColor='white'>
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
