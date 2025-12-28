import { db, storage } from "../config/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CLN_ANNOUNCEMENTS = "announcements";
const CLN_EVENTS = "events";

// ... Announcements Logic ...

export const subscribeToAnnouncements = (callback) => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(data);
    }, (error) => {
        console.warn("SubscribeAnnouncements Error:", error);
    });
};

export const addAnnouncement = async (data) => {
    await addDoc(collection(db, CLN_ANNOUNCEMENTS), { ...data, createdAt: new Date().toISOString() });
};

// ... Events Logic ...

export const subscribeToEvents = (callback) => {
    const q = query(collection(db, CLN_EVENTS), orderBy("date", "asc"));
    return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
};

export const addEvent = async (eventData, imageUri) => {
    try {
        let imageUrl = null;

        // 1. Upload Image if exists
        if (imageUri) {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const storageRef = ref(storage, `events/${Date.now()}_${eventData.title}`);
            await uploadBytes(storageRef, blob);
            imageUrl = await getDownloadURL(storageRef);
        }

        // 2. Save Event to Firestore
        await addDoc(collection(db, CLN_EVENTS), {
            ...eventData,
            imageUrl,
            createdAt: new Date().toISOString(),
            attendees: [] // Array of user IDs
        });

    } catch (error) {
        console.error("Error adding event:", error);
        throw error;
    }
};

export const toggleEventJoin = async (eventId, userId, isJoining) => {
    const eventRef = doc(db, CLN_EVENTS, eventId);
    if (isJoining) {
        await updateDoc(eventRef, { attendees: arrayUnion(userId) });
    } else {
        await updateDoc(eventRef, { attendees: arrayRemove(userId) });
    }
};
