// import React, { useState } from "react";
import Sidebar2 from "./Sidebar2";
import UserSelectionModal from "./UserSelectionModal";
import { useUser } from './UserContext';
import { db, auth } from "./firebaseConfig";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { getDocs, collection, doc, setDoc, where, query, getDoc, addDoc } from "firebase/firestore";
import './Groups.css';
const Groups = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const navigate = useNavigate();
  const user = useUser();

  const handleFollowButtonClick = (group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
    // Navigate to the group posts page
    navigate(`/groupposts/${group.id}/${group.groupName}`);
  };
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

  useEffect(() => {
    fetchAllGroups();
  }, []);
  

  const addUserToGroup = async (groupId) => {
    try {
      // Get the reference to the specific user document
      const userRef = doc(db, 'users', user.email);
  
      // Get or create the 'Pages' subcollection reference
      const pagesRef = collection(userRef, 'Pages');
  
      // Add a document to the 'Pages' subcollection with the groupId and using user's email as the document ID
      await setDoc(doc(pagesRef, groupId), {groupId});
  
      console.log(`User ${user.email} successfully added to group ${groupId}`);
    } catch (error) {
      console.error("An error occurred while adding user to group:", error);
    }
  };  

  const followGroup = async (groupId) => {
    try {
      // Get the reference to the specific group document
      const groupRef = doc(db, 'groups', groupId);
  
      // Fetch the current state of the group
      const groupSnapshot = await getDoc(groupRef);
      const groupData = groupSnapshot.data();
  
      // Check if the 'followers' field exists, if not, create it
      const updatedFollowers = groupData.followers ? [...groupData.followers, user.email] : [user.email];
  
      // Update the followers field by adding the user's email
      await setDoc(groupRef, { followers: updatedFollowers }, { merge: true });
  
      // Update the local state to reflect the change
      setUserGroups((prevUserGroups) =>
        prevUserGroups.map((group) =>
          group.id === groupId ? { ...group, followers: updatedFollowers } : group
        )
      );
      await addUserToGroup(groupId);
    } catch (error) {
      console.error("An error occurred while following the group:", error);
    }
  };
  
  const handleCreateGroupCallback = () => {
    fetchAllGroups();
  };

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
            <div className="grid-item" key={group.id} onClick={() => handleFollowButtonClick(group)}>
              <div className="grp-img" style={{ backgroundColor: getRandomColor() }}>
              </div>
              <h4>{group.groupName}</h4>
                <button
                className="button"
                style={{ backgroundColor: '#9b0303' }}
                onClick={() => followGroup(group.id)}
                disabled={group.followers && group.followers.includes(user.email)}
              >
                {group.followers && group.followers.includes(user.email) ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <UserSelectionModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onSelect={handleUserSelect}
        onCreateGroup={handleCreateGroupCallback}
      />
    </section>
  );
};

export default Groups;
