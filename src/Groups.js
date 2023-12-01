// import React, { useState } from "react";
import Sidebar2 from "./Sidebar2";
import UserSelectionModal from "./UserSelectionModal";
import { useUser } from './UserContext';
import { db, auth } from "./firebaseConfig";
import React, { useEffect, useState } from "react";
import { getDocs, collection, doc, setDoc, where, query } from "firebase/firestore";
import './Groups.css';
const Groups = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const user = useUser();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getRandomColor = () => {
    // Generate a random hexadecimal color
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  const handleUserSelect = (user) => {
    // Update selectedUsers state
    setSelectedUsers((prevSelectedUsers) => [
      ...prevSelectedUsers,
      { id: user.id, displayName: user.displayName },
    ]);
  };

  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        // Create a query to fetch all groups
        const groupsRef = collection(db, 'groups');
        const querySnapshot = await getDocs(groupsRef);
  
        // Extract the data from the documents
        const allGroupsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // Update the state with all groups
        setUserGroups(allGroupsData);
      } catch (error) {
        console.error("An error occurred while fetching all groups:", error);
      }
    };
  
    fetchAllGroups();
  }, []);
  
  

  console.log(userGroups);

  return (
    <section className="main">
      <Sidebar2 />
      <div className="top-btn-grp">
        <h3>Groups</h3>
        <button className="modal-btn-grp" onClick={openModal}>
            Create Group
        </button>
      </div>

      <div className="post-container">
        {/* Display your groups here */}
        <div className="grid-container">
          {userGroups.map((group) => (
            <div className="grid-item" key={group.id}>
              <div className="grp-img" style={{ backgroundColor: getRandomColor() }}>
              </div>
              <h4>{group.groupName}</h4>
              <button className="button" style={{backgroundColor: '#9b0303'}} >Follow</button>
            </div>
          ))}
        </div>
      </div>

      <UserSelectionModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onSelect={handleUserSelect}
      />
    </section>
  );
};

export default Groups;
