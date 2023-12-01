import React, { useState, useEffect} from 'react';
import './searchResults.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faSearch  } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import defimg from './Images/user.jpg';
import { Link, useNavigate } from "react-router-dom";
//firebase
import { db } from './firebaseConfig';
import { doc, getDoc, getDocs, collection, updateDoc } from "firebase/firestore";
//cookies
import Cookies from 'js-cookie';

const SearchResults = ({ users, posts }) => {
      const [activeTab, setActiveTab] = useState('users');
      /// fetch user email from cookies
      const userDet = Cookies.get('userDetails');
      var userObj = JSON.parse(userDet);
      var user_email = userObj.email;
      const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
      const [recentSearches, setRecentSearches] = useState([]);
      const location = useLocation();
      const navigate = useNavigate();
      const searchParams = new URLSearchParams(location.search);
      const queryTextg = searchParams.get('query');
      // const [profilePictureURL, setProfilePictureURL] = useState('');

      useEffect(() => {
        const fetchData = async () => {
          const userDocRef = doc(db, "users", user_email); // fetching current user data
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setRecentSearches(userDoc.data().recentlySearched);
          }

        }
        fetchData();

        }, [db]);

      const recentSearchClick = (search) => {
        if(search[0]!='/'){
        window.open(`/profileGlobal?uid=${search}`);
        }
        else{
          window.open(search);
        }
      }

      // Function to handle result click and update Firestore
      const handleUserItemClick = async (userEmail) => {
        // Open user profile in a new tab
        window.open(`/profileGlobal?uid=${userEmail}`, '_blank');
    
        // Update Firestore with the clicked user's email
        const userDocRef = doc(db, "users", user_email); // fetching current user data
        const userDoc = await getDoc(userDocRef);
        let recentSearches = [];
        if (userDoc.exists()) {
            recentSearches = userDoc.data().recentlySearched || [];
        }
        // Check if userEmail is not already in recentSearches and add accordingly
        if (!recentSearches.includes(userEmail)) {
            const updatedSearches = [...recentSearches, userEmail].slice(-10); // Keep only the last 10 searches
            await updateDoc(userDocRef, {
                recentlySearched: updatedSearches
            });
        }
    };
    

    const handlePostItemClick = async (postId) => {
      const postUrl = `/Posts?pid=${postId}`;
      // Open post in a new tab
      window.open(postUrl, '_blank');
  
      // Update Firestore with the clicked user's email
      const userDocRef = doc(db, "users", user_email); // fetching current user data
      const userDoc = await getDoc(userDocRef);
      let recentSearches = [];
      if (userDoc.exists()) {
          recentSearches = userDoc.data().recentlySearched || [];
      }
      // Check if postUrl is not already in recentSearches and add accordingly
      if (!recentSearches.includes(postUrl)) {
          const updatedSearches = [...recentSearches, postUrl].slice(-10); // Keep only the last 10 searches
          await updateDoc(userDocRef, {
              recentlySearched: updatedSearches
          });
      }
  };
  

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
          const users = allUsersSnapshot.docs.map(doc => {
            const userData = doc.data();
            return {
                ...userData, // Spread the existing user data
                email: doc.id, // Assuming the document ID is the email
            };
           }).filter(user => 
                  user.firstName.toLowerCase().includes(queryText.toLowerCase()) || 
                  user.lastName.toLowerCase().includes(queryText.toLowerCase())
              );
  
          // For posts
          const postsCollection = collection(db, 'posts');
          
          // Fetch all posts
          const allPostsSnapshot = await getDocs(postsCollection);
          
          // Filter posts based on the presence of queryText in the caption, case-insensitively
          const posts = allPostsSnapshot.docs.map(doc => {
            const postData = doc.data();
            return {
                ...postData,   // Spread all properties of the post
                id: doc.id     // Add the document's id
            };
        })
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
    console.log(recentSearches);

    return (
        <div className='base-container'>          
          <div className='heading-searchr'>
            <h1 >Search Results</h1>
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
                <button onClick={() => setActiveTab('searches')}>Recent Searches</button>
            </div>

            {activeTab === 'users' && searchResults.users && (
                  <div className="user-results">
                      {/* Map over the users and display them */}
                      <h2 className='h-searchr'>Users</h2>
                      {searchResults.users.map((user, index) => (
                      <div className='search-user-container'>
                      <img src={user.profilePicture || defimg} alt="Profile" className="search-profile-picture"/>
                      <div key={index} className="user-search-item" onClick={() => handleUserItemClick(user.email) }>
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
                          <div key={index} className="search-post-item" onClick={() => handlePostItemClick(post.id) }>
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

                {activeTab === 'searches' && recentSearches && (
                  <div className="recent-searches">
                      {/* Map over the recent searches and display them */}
                      <h2 className='h-searchr'>Recent Searches</h2>
                      {recentSearches.map((search, index) => (
                          <div key={index} className="search-recent-item">
                              <a onClick={() => recentSearchClick(search)}>
                                {search}
                                </a>
                          </div>
                        ))}
                  </div>
              )}

              </div>
        </div>
    );
};

export default SearchResults;
