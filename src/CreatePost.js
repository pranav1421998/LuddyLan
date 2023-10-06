import React, { useState } from 'react';
import {storage} from './firebaseConfig';
import './FileUpload.css'; 

function FileUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (file) {
      const storageRef = storage.ref();
      const fileRef = storageRef.child(file.name);

      fileRef.put(file).then(() => {
        console.log('File uploaded successfully.');
      });
    }
  };

  return (
    <div className="container">
      <h2>File Upload</h2>
      <label className="label">
        Choose File
        <input type="file" onChange={handleFileChange} />
      </label>
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default FileUpload;

