import Modal from "react-modal";
import { db, auth } from "./firebaseConfig";
import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { useLocation } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useUser } from './UserContext';
import defimg from './Images/user.jpg';
import './UserSelectionModal.css';

const UserSelectionModal = ({ isOpen, onRequestClose, onSelect }) => {
  const [users, setUsers] = React.useState([]);
  const location = useLocation();


  const [userdata, setDocuments] = useState([]); // State to store user data
  const user = useUser();

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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Select Users"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          width: '50%', // Adjust the width as needed
          margin: 'auto',
        },
      }}
    >
      <button className="close-btn" onClick={onRequestClose}>X</button>

      <div className="header">
      <h2>Select Users for the Group</h2>
      </div>
      <div className="user-container">
        <Menu>
          {userdata.map((user) => (
            <MenuItem key={user.id}>
              <div className='chat-user-container'>
                <img src={user.profilePicture || defimg} alt="Profile" className="chat-profile-picture" />
                <div className="user-name">
                  {user.firstName + ' ' + user.lastName}
                </div>
              </div>
            </MenuItem>
          ))}
        </Menu>
      </div>
      <div>
        <input
          type="text"
          placeholder="Group Name"
        //   onChange={handleInputChange}
        />
        <button >Submit</button>
      </div>
    </Modal>
  );
          
}

export default UserSelectionModal;
