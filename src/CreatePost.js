import React, { useState, useEffect } from 'react';
import { storage } from './firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './FileUpload.css';
import { v4 } from 'uuid';

function FileUpload() {
  const [imageUpload, setImageUpload] = useState(null);
  const [description, setDescription] = useState('');
  const [uploadTask, setUploadTask] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

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
          alert('Image and description uploaded');
        });
      });

      return () => {
        unsubscribe();
      };
    }
  }, [uploadTask, description]);

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
