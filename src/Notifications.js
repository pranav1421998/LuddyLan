// Notifications.js

import "./Notifications.css";
import Cookies from "js-cookie";
import { Button } from "react-bootstrap";
import { db, auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { doc, getDoc, getDocs, updateDoc, collection, arrayRemove } from "firebase/firestore";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        const user = auth.currentUser;

        if (user) {
            const userDocRef = doc(db, "users", user.email);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const notificationsRef = collection(userDocRef, 'notifications');
                const snapshot = await getDocs(notificationsRef);
                const notificationsData = snapshot.docs.map(doc => {
                    const alerts = doc.data().alerts || [];
                    return {
                        id: doc.id,
                        alerts: alerts,
                    };
                });

                setNotifications(notificationsData);
            } else {
                console.log('User document does not exist.');
            }
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const deleteNotification = async (notificationId, alert) => {
        try {
            const user = auth.currentUser;
            const userDocRef = doc(db, "users", user.email);
            const notificationsRef = collection(userDocRef, 'notifications');
            const notificationDocRef = doc(notificationsRef, notificationId);

            // update the array in Firestore to remove the specified notification
            await updateDoc(notificationDocRef, {
                alerts: arrayRemove(alert),
            });

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
                    {notifications.map(notification => (
                        <div key={notification.id}>
                            {notification.alerts.map((alert, index) => (
                                <li className="item" key={index}>
                                    <span>{alert}</span>
                                    <Button className="noti-btn" onClick={() => deleteNotification(notification.id, alert)}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </Button>
                                </li>
                            ))}
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Notifications;