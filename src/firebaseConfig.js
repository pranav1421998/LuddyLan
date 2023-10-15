
import { getStorage } from "firebase/storage";
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider,onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBchoNYXCrGHdcPrs326HQyoDNYfpTavlM",
  authDomain: "luddy-lan.firebaseapp.com",
  projectId: "luddy-lan",
  storageBucket: "luddy-lan.appspot.com",
  messagingSenderId: "291881690617",
  appId: "1:291881690617:web:6475e10fc8c5f82e03c928",
  measurementId: "G-7P277WPKRE"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export default firebaseConfig;
export { auth, db, provider, storage};
