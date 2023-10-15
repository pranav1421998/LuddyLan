import './dashboard.css';
import { db, auth } from "./firebaseConfig";
import React, { useEffect, useState } from "react";
import { doc, getDoc, getDocs, updateDoc, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {

        const fetchPosts = async () => {
            const collectionRef = collection(db, 'posts');
            const querySnapshot = await getDocs(collectionRef);
            const documentsData = [];
            querySnapshot.forEach((doc) => {
              documentsData.push({ id: doc.id, ...doc.data() });
            });
            setPosts(documentsData);
            
            documentsData.forEach((data) => {
                // const collectionData = document.getElementById(data.id);
                // console.log(collectionData.data);
            });

        };
        fetchPosts();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, "users", user.email);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserDetails({ id: userDoc.id, ...userDoc.data() }); // Include the document ID in the user data
                    // Update a single field in the document
                    try {
                        await updateDoc(userDocRef, {
                            loggedIn: true
                        });
                        window.status = true;
                        console.log("Document successfully updated!");
                        } catch (error) {
                        console.error("Error updating document: ", error);
                        }
                } else {
                    console.log("No such document!");
                }
            } else {
                console.log("No user is signed in");
            }
        });
    }, [auth, db]);

    return (
            
    <section className="main">
        <div className="post-container">
            <ul>
            {posts.map((post) => (
            <li key={post.id}>
            <div className="post">
                {/* post header */}
                <div className="post-header">
                    <p className="user-icon"><FontAwesomeIcon icon={faUser}/></p>
                <p className= "username">{post.ownerId}</p> 
                </div>
                {/* post caption */}
                <div className="post-detail">
                    <p style={{color: 'black'}}>{post.caption}</p>    
                </div>
                {/* post section */}
                <div className="post-feed">
                    <img src={post.media} className="image-container" alt="Image" />
                </div>
                {/* post buttons */}
                <div className="detail-interactions">
                    <button className="btn"><FontAwesomeIcon icon={faThumbsUp}/> Like</button>
                    <button className="btn"><FontAwesomeIcon icon={faComment}/> Comment</button>
                    <button className="btn"><FontAwesomeIcon icon={faShare}/> Share</button>

                </div>
                
            </div>
                
            </li>
            ))}
            </ul>
        </div>
    </section>

    );
};

export default Dashboard;