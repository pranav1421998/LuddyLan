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
    const fetchUserGroups = async () => {
      try {
        if (!user) {
          console.log("User is not logged in");
          return; // Exit the function if there is no user logged in
        }

        // Create a query to fetch groups where users array includes user.email
        const groupsRef = collection(db, 'groups');
        const q = query(groupsRef, where('users', 'array-contains', user.email));
        const querySnapshot = await getDocs(q);

        // Extract the data from the documents
        const userGroupsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Update the state with the user's groups
        setUserGroups(userGroupsData);
      } catch (error) {
        console.error("An error occurred while fetching user groups:", error);
      }
    };

    fetchUserGroups();
  }, [user]);

  console.log(userGroups);

  return (
    <section className="main">
      <Sidebar2 />
      <div className="top-btn-grp">
        {/* <h3>Groups</h3> */}
        <button className="modal-btn" onClick={openModal}>
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
