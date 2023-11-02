import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './profileSettings.css';
import { db, auth } from './firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, getDocs, updateDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';

function ProfileSettings() {
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  /// fetch user details from cookies
  const userDet = Cookies.get('userDetails');
  var userObj = JSON.parse(userDet);
  var email = userObj.email;

  useEffect(() => {
    // Fetch current profile settings from Firestore here
    // Update isProfilePublic with the retrieved setting
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userEmail = user.email;
        const userRef = doc(db, 'users', userEmail);
        getDoc(userRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const isPublic = { ...docSnapshot.data()}.isProfilePublic;
              setIsProfilePublic(isPublic);
            }
          });
      
      } else {
        //user not logged in
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSaveSettings = async() => {


      const userDocRef = doc(db, "users", email);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {   
          try {
              await updateDoc(userDocRef, {
                  isProfilePublic: isProfilePublic
              });
              console.log("Document successfully updated!");
              } catch (error) {
              console.error("Error updating document: ", error);
              }
      } else {
          console.log("No such document!");
      }
   
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
