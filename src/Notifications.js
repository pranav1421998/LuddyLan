// Notifications.js

import "./Notifications.css";
import Cookies from "js-cookie";
import { Button } from "react-bootstrap";
import { db, auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { doc, getDoc, getDocs, deleteDoc, collection } from "firebase/firestore";

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

    const navigateToGroup = (gId, gName) => {
        window.open(`/groupposts/${gId}/${gName}`);
      };

    const fetchNotifications = async () => {
        const user = auth.currentUser;
    
        if (user) {
            const userDocRef = doc(db, "users", user.email);
            const userDoc = await getDoc(userDocRef);
    
            if (userDoc.exists()) {
                const notificationsRef = collection(userDocRef, 'notifications');
                const snapshot = await getDocs(notificationsRef);
    
                if (snapshot && !snapshot.empty) {
                    const notificationsData = snapshot.docs.map(doc => {
                        return {
                            id: doc.id,
                            message: doc.data().message || '',
                            name: doc.data().name || '',
                            group_id:  doc.data().group_id || ''
                        };
                    });
    
                    // Update the state with the fetched data
                    setNotifications(notificationsData);
                } else {
                    console.log('No notifications found.');
                }
            } else {
                console.log('User document does not exist.');
            }
        } else {
            console.log('No user is signed in.');
        }
    };        

    useEffect(() => {
        fetchNotifications();
    }, []);

    console.log('Notifications:', notifications);

    const deleteNotification = async (notificationId) => {
        try {
            const user = auth.currentUser;
            const userDocRef = doc(db, "users", user.email);
            const notificationsRef = collection(userDocRef, 'notifications');
            const notificationDocRef = doc(notificationsRef, notificationId);
    
            // delete the entire notification document
            await deleteDoc(notificationDocRef);
    
            // refresh the notifications after the deletion
            fetchNotifications();
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };    

    return (
        <div className="border">
          <div className="header1">Notifications</div>
          <div className="bg">
            <ul>
              {notifications && notifications.map((notification) => (
                <div key={notification.id}>
                  {notification.message && (
                    <li className="item">
                      <span onClick={() => navigateToGroup(notification.group_id, notification.name)}>{notification.message}</span>
                      <Button className="noti-btn" onClick={() => deleteNotification(notification.id)}>
                        <FontAwesomeIcon icon={faTrash}/>
                      </Button>
                    </li>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      );    
    
};

export default Notifications;