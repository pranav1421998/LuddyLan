import React, { useState, useEffect } from 'react';
import './EditModal.css';

function EditModal({ userData, isOpen, onClose, onSave }) {
  const [editedData, setEditedData] = useState(userData);
  useEffect(() => {
    // Update the editedData when userData changes
    setEditedData(userData);
  }, [userData]);
  const handleSave = () => {
    onSave(editedData);
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="profile-modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h3>Edit Profile</h3>
        <form>
        <div>
        <label>First Name: </label>
          <input
            type="text"
            placeholder="First Name"
            value={editedData.firstName}
            onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
          />
          </div>
          <div>
          <label>Last Name: </label>
          <input
            type="text"
            placeholder="Last Name"
            value={editedData.lastName}
            onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
          />
          </div>
          <div>
           <label>Phone Number: </label>
          <input
            type="text"
            placeholder="Phone Number"
            value={editedData.phone}
            onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
          />
          </div>
        </form>
        <button onClick={handleSave} className='close-button'>Save</button>
      </div>
    </div>
  );
}

export default EditModal;
