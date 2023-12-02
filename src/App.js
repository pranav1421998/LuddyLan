import './App.css';
import Chat from "./Chat";
import React from "react";
import Login from "./Login.js";
import Posts from "./Posts.js";
import Navbar from "./Navbar.js";
import PollList from "./PollList";
import Password from "./password";
import Profile from "./profile.js";
import Dashboard from "./dashboard";
import MyFriends from "./MyFriends";
import AllUsers from "./AllUsers.js";
import PollForm from "./CreatePoll.js";
import LandingPage from "./LandingPage";
import { Register } from "./Register.js";
import FileUpload from "./CreatePost.js";
import SearchResults from "./searchResults";
import { UserProvider } from './UserContext';
import ProfileGlobal from './profileGlobal.js';
import FriendRequests from "./FriendRequests.js";
import ProfileSettings from "./profileSettings.js";
import PasswordRecovery from "./passwordRecovery.js";
import Groups from './Groups.js';
import Groupposts from './Groupposts.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateGroupPosts from './CreateGroupposts.js';

function App() {
  const auth = getAuth(); // Initialize the auth instance
  const [currentForm, setCurrentForm] = React.useState("login");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("(From App) User signed in:", user.displayName); // User is signed in
    } else {
      console.log("(From App) User is signed out."); // User is signed out
    }
  });

  return (
    <UserProvider > {/* Wrap your app with the UserProvider */}
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/password" element={<Password />} />
            <Route path="/PollForm" element={<PollForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/passwordrecovery" element={<PasswordRecovery />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/CreatePost" element={<FileUpload />} />
            <Route path="/friendRequests" element={<FriendRequests />} />
            <Route path="/allUsers" element={<AllUsers />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profileSettings" element={<ProfileSettings />} />
            <Route path="/myFriends" element={<MyFriends />} />
            <Route path="/" element={< LandingPage/>} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/PollList" element={< PollList/>} />
            <Route path="/searchResults" element={<SearchResults/>} />
            <Route path="/Chat" element={<Chat/>} />
            <Route path="/profileGlobal" element={<ProfileGlobal/>} />
            <Route path="/Posts" element={<Posts />} />
            <Route path="/Groups" element={<Groups />} />
            <Route path="/groupposts/:groupId/:groupName" element={<Groupposts />} />
            <Route path="/creategroupposts" element={<CreateGroupPosts />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;