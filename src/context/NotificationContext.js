// javascript
import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { subscribeToNotifications } from '../services/notificationService';
import { AuthContext } from './AuthContext';
import { Alert } from 'react-native';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const isFirstLoad = useRef(true);

    useEffect(() => {
        // Only subscribe if user is logged in
        if (!user) {
            setNotifications([]);
            return;
        }

        const unsubscribe = subscribeToNotifications((data) => {
            setNotifications(data);

            // Real-Time Alert Logic
            // If NOT first load, and latest item is very recent (naive check), assume it's new
            if (!isFirstLoad.current && data.length > 0) {
                const latest = data[0];
                // Compare with previous state or just simple "change" detection
                // Here we just alert the top item if it's "fresh" (e.g. created in last 10s is a safe bet for "just happened")

                const now = new Date();
                const created = new Date(latest.createdAt);
                const diffSeconds = (now - created) / 1000;

                // If created within last 30 seconds and we received an update
                if (diffSeconds < 30) {
                    Alert.alert(
                        "New Update!",
                        `${latest.type === 'event' ? 'New Event:' : 'Announcement:'} ${latest.title}  `
                    );
                    setUnreadCount(prev => prev + 1);
                }
            }

            isFirstLoad.current = false;
        });

        return unsubscribe;
    }, [user]); // Re-run when user logging state changes

    const markRead = () => {
        setUnreadCount(0);
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markRead }}>
            {children}
        </NotificationContext.Provider>
    );
}
