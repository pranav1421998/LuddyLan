import React, { useState, useEffect } from 'react';
import { auth, db, provider } from "./firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { storage } from './firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import './FileUpload.css';
import { v4 } from 'uuid';

function FileUpload({ onClose }) {
  const [imageUpload, setImageUpload] = useState(null);
  const [description, setDescription] = useState('');
  const [uploadTask, setUploadTask] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (uploadTask) {
      const unsubscribe = uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, (error) => {
        console.error('Upload error:', error);
      }, () => {
        console.log('Upload completed successfully');
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('Image URL:', downloadURL);
          console.log('Description:', description);
          saveToFirestore(downloadURL);
          onClose();
        });
      });

      return () => {
        unsubscribe();
      };
    }
  }, [uploadTask, description]);

  const getCurrentUser = () => {
    const authObserver = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return authObserver;
  };

  useEffect(() => {
    const authObserver = getCurrentUser();

    return () => {
      authObserver();
    };
  }, []);

  const handleUpload = () => {
    if (imageUpload) {
      const imageref = ref(storage, `images/${imageUpload.name + v4()}`);
      const uploadTask = uploadBytesResumable(imageref, imageUpload);
      setUploadTask(uploadTask);
    }
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    setImageUpload(selectedFile);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const saveToFirestore = (downloadURL) => {
    if (user) {
      const postsCollection = collection(db, 'posts');
      const newPost = {
        caption: description,
        media: downloadURL,
        ownerId: user.email,
        uploadedDate: Timestamp.fromDate(new Date()),
      };
      addDoc(postsCollection, newPost)
        .then(() => {
          alert('Succesfully created a post');
        })
        .catch((error) => {
          console.error('Error adding post to Firestore: ', error);
        });
    }
  };

  return (
    <div className="container">
      <h2>File Upload</h2>
      <label className="label">
        Choose File
        <input type="file" onChange={handleFileSelect} />
      </label>
      {imageUpload && (
        <div className="file-name">
          Selected File: {imageUpload.name}
        </div>
      )}
      <label className="label">
        Describe Image/Video
        <input type="text" value={description} onChange={handleDescriptionChange} />
      </label>
      <button onClick={handleUpload}>Upload</button>
      {uploadTask && (
        <div className="progress-bar">
          Upload Progress: {uploadProgress.toFixed(2)}%
          <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;