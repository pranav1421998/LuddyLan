import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './searchResults.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faSearch  } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
//firebase
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
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
          
            setSearchResults({
                users: users, 
                posts: posts
            });
            // console.log(posts);
            // console.log(users);
            console.log(searchResults);
        }
        else{
          setSearchResults({
            users: [], 
            posts: []
        });
        }
    };

    return (
        <div className='main'>
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

            <div className="tabs">
                <button onClick={() => setActiveTab('users')}>Users</button>
                <button onClick={() => setActiveTab('posts')}>Posts</button>
            </div>

            {activeTab === 'users' && searchResults.users && (
                  <div className="user-results">
                      {/* Map over the users and display them */}
                      <h5>Users</h5>
                      {searchResults.users.map((user, index) => (
                      <div key={index} className="search-item">
                          {user.firstName} {user.lastName}
                          {/* more user details or a link to the user's profile here */}
                      </div>
                  ))}
                  </div>
              )}

              {activeTab === 'posts' && searchResults.posts && (
                  <div className="post-results">
                      {/* Map over the posts and display them */}
                      <h5>Posts</h5>
                      {searchResults.posts.map((post, index) => (
                          <div key={index} className="search-dropdown-item">
                              {post.caption}
                              {/* more user details or a link to the post here */}
                          </div>
                        ))}
                  </div>
              )}
        </div>
    );
};

export default SearchResults;
