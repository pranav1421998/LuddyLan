import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './profileSettings.css';
import Sidebar from './Sidebar';

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
    <div className='container'>
      <Sidebar />
      <div className='main-content'>
        <h1 className='settings-header'>Profile Settings</h1>
        <div className='settings-card'>
          <div className='setting'>
            <label>
              Profile Public:
              <input
                type="checkbox"
                checked={isProfilePublic}
                onChange={() => setIsProfilePublic(!isProfilePublic)}
              />
            </label>
          </div>
          <button className='button save-button' onClick={handleSaveSettings}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;
