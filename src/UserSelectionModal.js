import Modal from "react-modal";
import { db, auth } from "./firebaseConfig";
import React, { useEffect, useState } from "react";
import { getDocs, collection, doc, setDoc } from "firebase/firestore";
import { useLocation } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useUser } from './UserContext';
import defimg from './Images/user.jpg';
import './UserSelectionModal.css';
import { faHome, faUser, faUsers, faComment, faImage, faPenToSquare, faSquareCheck, faSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserSelectionModal = ({ isOpen, onRequestClose, onSelect }) => {
    const [users, setUsers] = React.useState([]);
    const [selectedUsers, setSelectedUsers] = React.useState([]);
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
  
    // Function to handle user selection
    const handleUserSelect = (userId) => {
      const isSelected = selectedUsers.includes(userId);
  
      if (isSelected) {
        // If user is already selected, remove from the list
        setSelectedUsers(prevSelectedUsers =>
          prevSelectedUsers.filter(id => id !== userId)
        );
      } else {
        // If user is not selected, add to the list
        setSelectedUsers(prevSelectedUsers => [...prevSelectedUsers, userId]);
      }
    };

    const [groupName, setGroupName] = useState('');

  // Function to handle the "Create" button click
  const handleCreateGroup = async () => {
    try {
      if (!groupName.trim() || selectedUsers.length === 0) {
        // Ensure group name is not empty and at least one user is selected
        return;
      }
      selectedUsers.push(user.email);
      // Create a new group object
      const newGroup = {
        groupName: groupName.trim(),
        admins: selectedUsers,
        createdTimeStamp: new Date(),
      };

      // Save the new group to the groups collection
      const groupsRef = collection(db, 'groups');
      await setDoc(doc(groupsRef), newGroup);

      // Close the modal
      onRequestClose();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };
  
    
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
            width: '50%',
            margin: 'auto',
          },
        }}
      >
        <button className="close-btn" onClick={onRequestClose}>X</button>
        <div className="header">
          <h2>Select Admin(s) for the Group</h2>
        </div>
        <div className="user-container">
          <Menu>
            {userdata.map((user) => (
              <MenuItem key={user.id}>
                <div
                  className={`group-user-container ${selectedUsers.includes(user.id) ? 'selected' : ''}`}
                  onClick={() => handleUserSelect(user.id)}
                >
                  <img src={user.profilePicture || defimg} alt="Profile" className="chat-profile-picture" />
                  <div className="user-name">
                    {user.firstName + ' ' + user.lastName}
                  </div>
                  <div className="select-icon">{selectedUsers.includes(user.id) ? <FontAwesomeIcon icon={faSquareCheck} /> : <FontAwesomeIcon icon={faSquare} />}</div>
                </div>
              </MenuItem>
            ))}
          </Menu>
        </div>
        <div>
          <input
            type="text"
            placeholder="Group Name"
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button className="button" onClick={handleCreateGroup}>Create</button>
        </div>
      </Modal>
    );
  }
  
  export default UserSelectionModal;