import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './searchResults.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faSearch  } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import defimg from './Images/user.jpg';
//firebase
import { db } from './firebaseConfig';
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
//cookies
import Cookies from 'js-cookie';

const SearchResults = ({ users, posts }) => {
    const [activeTab, setActiveTab] = useState('users');
    const [searchResults, setSearchResults] = useState({
      users: [],
      posts: []
      });
      const location = useLocation();
      const searchParams = new URLSearchParams(location.search);
      const queryTextg = searchParams.get('query');
      // const [profilePictureURL, setProfilePictureURL] = useState('');

      const formatTimestamp = (timestamp) => {
        const date = timestamp.toDate();
        const options = { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleString(undefined, options);
      };

      const setPictureURL = async (email) => {
        try {
            const friendUserDocRef = doc(db, "users", email);
            const friendUserDoc = await getDoc(friendUserDocRef);
            if (friendUserDoc.exists()) {
                const friendUserData = friendUserDoc.data();
                // console.log(friendUserData.profilePicture);
                // setProfilePictureURL(friendUserData.profilePicture);
                return friendUserData.profilePicture || defimg;
            } else {
                console.error("No such document for friend user:", email);
                return defimg;
            }
        } catch (error) {
            console.error("Error fetching friend's profile picture:", error);
            return defimg;
        }
      };


    const handleSearch = async (queryText) => {
    
      if (queryText) {
          const usersCollection = collection(db, 'users');
          
          // Fetch all users
          const allUsersSnapshot = await getDocs(usersCollection);
          
          // Filter users based on the presence of queryText in firstName or lastName, case-insensitively
          const users = allUsersSnapshot.docs.map(doc => doc.data())
              .filter(user => 
                  user.firstName.toLowerCase().includes(queryText.toLowerCase()) || 
                  user.lastName.toLowerCase().includes(queryText.toLowerCase())
              );
  
          // For posts
          const postsCollection = collection(db, 'posts');
          
          // Fetch all posts
          const allPostsSnapshot = await getDocs(postsCollection);
          
          // Filter posts based on the presence of queryText in the caption, case-insensitively
          const posts = allPostsSnapshot.docs.map(doc => doc.data())
              .filter(post => 
                  post.caption.toLowerCase().includes(queryText.toLowerCase())
              );

              const postsWithPictures = await Promise.all(posts.map(async (post) => {
                const profilePicture = await setPictureURL(post.ownerId);
                return {
                  ...post,
                  profilePicture, // this is the URL you fetched
                };
              }));
          
            setSearchResults({
                users: users, 
                posts: postsWithPictures
            });
        }
        else{
          setSearchResults({
            users: [], 
            posts: []
        });
        }
    };

    return (
        <div className='base-container'>          
          <div>
            <h1>Search Results</h1>
            <input 
              type="text" 
              placeholder='search'
              onChange={(e) => handleSearch(e.target.value)} 
          />
            <FontAwesomeIcon 
              icon={faSearch} 
              className="search-icon-1"
              onClick={() => handleSearch}
            />
            </div>
            <div className='tab-container'>

            <div className="tabs-search">
                <button onClick={() => setActiveTab('users')}>Users</button>
                <button onClick={() => setActiveTab('posts')}>Posts</button>
            </div>

            {activeTab === 'users' && searchResults.users && (
                  <div className="user-results">
                      {/* Map over the users and display them */}
                      <h2 className='h-searchr'>Users</h2>
                      {searchResults.users.map((user, index) => (
                      <div className='search-user-container'>
                      <img src={user.profilePicture || defimg} alt="Profile" className="search-profile-picture"/>
                      <div key={index} className="search-item">
                          {user.firstName} {user.lastName}
                          {/* more user details or a link to the user's profile here */}
                      </div>
                      </div>
                  ))}
                  </div>
              )}

              {activeTab === 'posts' && searchResults.posts && (

                  <div className="post-results">
                      {/* Map over the posts and display them */}
                      
                      <h2 className='h-searchr'>Posts</h2>
                      {searchResults.posts.map((post, index) => (
                          <div key={index} className="search-post-item">
                              <div className="search-post-header">
                                {/* fetch dp */}
                                <img src={post.profilePicture} alt="Profile" className="search-profile-picture"/>
                                <div className="post-info">
                                  <p className="username">{post.ownerId}</p>
                                  <p className="date">{formatTimestamp(post.uploadedDate)}</p>
                                  <p className="search-caption">{post.caption}</p>
                                  {/* more details */}
                                </div>
                              </div>
                              <div className="post-body">
                                <img src={post.media} alt="Post" className="post-image"/>
                              </div>
                          </div>
                        ))}
                  </div>
              )}
              </div>
        </div>
    );
};

export default SearchResults;
