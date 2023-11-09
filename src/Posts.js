import './dashboard.css';
import Cookies from 'js-cookie';
import Sidebar2 from './Sidebar2';
import Comments from './Comments';
import PollPopup from './CreatePoll';
import CreatePost from './CreatePost';
import { db, auth } from "./firebaseConfig";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp, faComment, faShare, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { doc, getDoc, getDocs, setDoc, deleteDoc, orderBy, query, where, collection } from "firebase/firestore";

const Posts = () => {
    const { postId } = useParams();
  
//   useEffect(() => {
//     const fetchData = async() => {
  
//     const postDocRef = doc(db, "posts", postId);
//     const postDoc = await getDoc(postDocRef);
  
//     if (postDoc.exists()) {
//       const postData = { id: postDoc.id, ...postDoc.data() };
//       setPosts([postData]); // Set as an array to maintain consistency with your state structure
//     } else {
//       console.error("No such document for post:", postId);
//     }
//     };
//     const unsubscribe = onAuthStateChanged(auth, fetchData);
//     return () => unsubscribe();
//   }, [db]);

return( 
   <p> {{postId}} </p>
)
};

export default Posts;