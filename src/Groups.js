import React, { useState } from "react";
import Sidebar2 from "./Sidebar2";
import UserSelectionModal from "./UserSelectionModal";

const Groups = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUserSelect = (user) => {
    // Update selectedUsers state
    setSelectedUsers((prevSelectedUsers) => [
      ...prevSelectedUsers,
      { id: user.id, displayName: user.displayName },
    ]);
  };

  return (
    <section className="main">
      <Sidebar2 />
      <div className="top-btn">
        <button className="modal-btn" onClick={openModal}>
          Create Group
        </button>
      </div>
      <div className="post-container">{/* Display your groups here */}</div>

      <UserSelectionModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onSelect={handleUserSelect}
      />
    </section>
  );
};

export default Groups;
