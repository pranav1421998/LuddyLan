import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './profileSettings.css';

function ProfileSettings() {
  const [isProfilePublic, setIsProfilePublic] = useState(true);

  useEffect(() => {
    // Fetch current profile settings from Firestore here
    // Update isProfilePublic with the retrieved setting
  }, []);

  const handleSaveSettings = () => {
    // Save updated profile settings to Firestore here
  };

  return (
    <div className='settings-container'>
      <h1>Profile Settings</h1>
      <label>
        Profile Public:
        <input
          type="checkbox"
          checked={isProfilePublic}
          onChange={() => setIsProfilePublic(!isProfilePublic)}
        />
      </label>
      <button onClick={handleSaveSettings}>Save Settings</button>
      <button><Link to="/profile">Profile</Link></button>
      <button><Link to="/dashboard">Dashboard</Link></button>
    </div>
  );
}

export default ProfileSettings;
