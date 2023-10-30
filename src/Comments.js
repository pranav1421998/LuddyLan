import './Comments.css'

import { db, auth } from "./firebaseConfig";

import React, { useState, useEffect } from "react";

import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';

import { doc, setDoc, getDoc, getDocs, collection, addDoc, query, where, orderBy } from "firebase/firestore";



const Comments = ({ postId, onClose }) => {

  const user = auth.currentUser;

  const [userInfo, setUserInfo] = useState({});

  const [comments, setComments] = useState([]);

  const [newComment, setNewComment] = useState("");



  const addComment = async () => {

    if (newComment.trim() === "") {

      return; // Prevent adding empty comments

    }



    // Add a new comment to the "comments" collection

    const commentsCollection = collection(db, "posts", postId, "comments");



    try {

      await addDoc(commentsCollection, {

        text: newComment,

        userId: auth.currentUser.email, // Use the current user's email as the user ID

        timestamp: new Date(),

      });

      setNewComment(""); // Clear the comment input field

    } catch (error) {

      console.error("Error adding comment: ", error);

    }

    fetchComments();

  };



  const fetchComments = async () => {

    const commentsCollection = collection(db, "posts", postId, "comments");

    const q = query(commentsCollection, orderBy("timestamp"));

    const querySnapshot = await getDocs(q);

    const commentsArray = [];

    querySnapshot.forEach((doc) => {

      commentsArray.push(doc.data());

    });

    setComments(commentsArray);

  };



  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (user) {

        const userEmail = user.email;

        const userRef = doc(db, 'users', userEmail);

        getDoc(userRef)

          .then((docSnapshot) => {

            if (docSnapshot.exists()) {

              const userData = { id: docSnapshot.id, ...docSnapshot.data() };

              setUserInfo(userData);

            }

          });

      } else {

        setUserInfo({});

      }

    });

    fetchComments();

    return () => unsubscribe();

  }, [postId]);



  return (

    <div className="comments-popup">

      <div className="close-header">

        <button className="close-btn" onClick={onClose}>Close <FontAwesomeIcon icon={faTimes} /></button>

      </div>

      <div className="comments-list">

        {comments.map((comment, index) => (

          <div key={index} className="comment">

            <p className="comment-user">{userInfo.firstName + " " + userInfo.lastName + ": " + comment.text}</p>

          </div>

        ))}

      </div>

      <div className="add-comment">

        <input

          type="text"

          placeholder="Type your comment..."

          value={newComment}

          onChange={(e) => setNewComment(e.target.value)}

        />

        <button className="send-btn" onClick={addComment}><FontAwesomeIcon icon={faPaperPlane} /></button>

      </div>

    </div>

  );

};



export default Comments;