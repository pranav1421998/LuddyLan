import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './profile.css';
import Sidebar from './Sidebar';
import userImage from './Images/user.jpg';
import { doc, getDoc, collection, query, getDocs } from 'firebase/firestore';
import { db, auth} from './firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';


function Profile() {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // Setting up an authentication state observer
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userEmail = user.email;
        // Fetch user details
        const userRef = doc(db, 'users', userEmail);
        getDoc(userRef).then(docSnapshot => {
          if (docSnapshot.exists()) {
            setUserInfo({id: docSnapshot.id, ...docSnapshot.data()});
          }
        });

        // Fetch user posts
        const postsQuery = query(collection(db, `users/${userEmail}/posts`));
        getDocs(postsQuery).then(async(querySnapshot) => {
          const posts = querySnapshot.docs.map(doc => ({
            id: doc.id,     // Store the document ID
            ...doc.data(),  // Store the post data
            //url: await getDownloadURL(ref(getStorage(), doc.Media))
          }));
            setUserPosts(posts); 
        });


      } else {
        // User is signed out
        setUserInfo({});
        setUserPosts([]);
      }
    });

    // Cleanup the observer on component unmount
    return () => unsubscribe();
  }, []);



  return (
    <div className='container'>
        <Sidebar />
        <div className='main-content'>
            <div className='post-container'>
                <img src={userImage} alt="Profile Picture" className='profile-picture' />
                <h1 className='profile-header'>{userInfo.firstName}'s Profile</h1>
                {/* Map through userPosts to display each post */}
                {userPosts.map(post => (
                    <div className='post' key={post.id}>
                        <p>Post ID: {post.id}</p>
                        <p>Caption: {post.Caption}</p>
                        <img src={post.Media} alt="Post" className='post-image' />
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}

export default Profile;
