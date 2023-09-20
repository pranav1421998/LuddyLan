import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Register} from './Register.js';
import {Login} from './Login.js';

function App() {
  const {currentForm,setCurrentForm} = useState('login');
  return (
    <div className="App">
      <header className="App-header">
        <Login></Login>
      </header>
    </div>
  );
}

export default App;
