// src/SearchResults.js
import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = () => {
  return (
    <div className='main'>
      <h1>Search Results</h1>
      <div>
        <Link to="/search-results/users">Users</Link>
        <Link to="/search-results/posts">Posts</Link>
      </div>
      {/* Add your logic to display users or posts based on the selected tab here */}
    </div>
  );
};

export default SearchResults;