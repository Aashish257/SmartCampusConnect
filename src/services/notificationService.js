import { db } from "../config/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const CLN_ANNOUNCEMENTS = "announcements";
const CLN_EVENTS = "events";

export const subscribeToNotifications = (callback) => {
    // We need to listen to both collections independently and merge updates.
    // This is a simplified client-side merge.

    let announcements = [];
    let events = [];

    const update = () => {
        // Merge and sort DESC by createdAt
        const combined = [...announcements, ...events].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA; // Newest first
        });
        callback(combined);
    };

    const qAnnounce = query(collection(db, CLN_ANNOUNCEMENTS), orderBy("createdAt", "desc"));
    const unsubAnnounce = onSnapshot(qAnnounce, (snap) => {
        announcements = snap.docs.map(doc => ({
            id: doc.id,
            type: 'announcement',
            ...doc.data()
        }));
        update();
    }, (error) => {
        console.warn("NotificationService Announcement Error:", error);
    });

    const qEvents = query(collection(db, CLN_EVENTS), orderBy("createdAt", "desc"));
    const unsubEvents = onSnapshot(qEvents, (snap) => {
        events = snap.docs.map(doc => ({
            id: doc.id,
            type: 'event',
            ...doc.data()
        }));
        update();
    }, (error) => {
        console.warn("NotificationService Event Error:", error);
    });

    return () => {
        unsubAnnounce();
        unsubEvents();
    };
};
