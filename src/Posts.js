import './dashboard.css';
import Cookies from 'js-cookie';
import Sidebar2 from './Sidebar2';
import Comments from './Comments';
import PollPopup from './CreatePoll';
import CreatePost from './CreatePost';
import { db, auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { faUser, faThumbsUp, faComment, faShare, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { doc, getDoc, getDocs, setDoc, deleteDoc, orderBy, query, where, collection } from "firebase/firestore";

const Posts = () => {
    // const { postId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [post, setPost] = useState([]);
    const searchParams = new URLSearchParams(location.search);
    const postId = searchParams.get('pid');
  
   useEffect(() => {
    const fetchData = async() => {
  
    const postDocRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postDocRef);
  
    if (postDoc.exists()) {
      const postData = { id: postDoc.id, ...postDoc.data() };
      setPost([postData]);
    } else {
      console.error("No such document for post:", postId);
    }
    };
    const unsubscribe = onAuthStateChanged(auth, fetchData);
    return () => unsubscribe();
  }, [db]);

  return (
    <div>
      <h2>Post Details</h2>
      <p>ID: {post.id}</p>
      <p>Owner: {post.ownerId}</p>
      {/* Other post details */}
    </div>
  );
};

export default Posts;