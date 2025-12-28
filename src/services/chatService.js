import { db } from "../config/firebase";
import {
    collection, query, where, getDocs, addDoc,
    onSnapshot, orderBy, doc, setDoc, updateDoc, serverTimestamp, getDoc
} from "firebase/firestore";

const CLN_USERS = "users";
const CLN_CHATS = "chats";
const CLN_MESSAGES = "messages";

// 1. Get all users (excluding self) to start a chat
export const getAllUsers = async (currentUserId) => {
    try {
        const q = query(collection(db, CLN_USERS));
        const snapshot = await getDocs(q);
        return snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(u => u.id !== currentUserId);
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

// 2. Create or Get existing Chat ID
export const createOrGetChat = async (currentUserId, otherUser) => {
    // Check if chat already exists (Naive approach: store chat ID in user doc or query chats)
    // For this project, we'll just query the 'chats' collection where participants array contains both.

    // Complex query alternative: query chats where participants array-contains currentUserId
    // then filter client-side for otherUserId.

    const q = query(collection(db, CLN_CHATS), where("participants", "array-contains", currentUserId));
    const snapshot = await getDocs(q);

    const existingChat = snapshot.docs.find(doc =>
        doc.data().participants.includes(otherUser.id)
    );

    if (existingChat) {
        return existingChat.id;
    }

    // Create new chat
    const newChatRef = doc(collection(db, CLN_CHATS));
    await setDoc(newChatRef, {
        participants: [currentUserId, otherUser.id],
        participantDetails: {
            [currentUserId]: { name: "Me" }, // Placeholder, better if we passed full user obj
            [otherUser.id]: { name: otherUser.name }
        },
        lastMessage: {
            text: "Chat started",
            createdAt: new Date().toISOString()
        },
        createdAt: serverTimestamp()
    });

    return newChatRef.id;
};

// 3. Subscribe to list of my chats
export const subscribeToUserChats = (userId, callback) => {
    const q = query(collection(db, 'chats'), where('users', 'array-contains', userId), orderBy('lastMessage.createdAt', 'desc'));

    return onSnapshot(q, async (snapshot) => {
        const chats = await Promise.all(snapshot.docs.map(async doc => {
            const data = doc.data();
            const otherUserId = data.users.find(uid => uid !== userId);
            const otherUserSnap = await getDoc(doc(db, 'users', otherUserId));
            const otherUserName = otherUserSnap.exists() ? otherUserSnap.data().name : 'Unknown';

            return { id: doc.id, ...data, otherUserName };
        }));

        callback(chats);
    }, (error) => {
        console.warn("SubscribeUserChats Error:", error);
    });
};

// 4. Subscribe to messages in a chat
export const subscribeToMessages = (chatId, callback) => {
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'));

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages);
    }, (error) => {
        console.warn("SubscribeMessages Error:", error);
    });
};

// 5. Send a message
export const sendMessage = async (chatId, text, senderId) => {
    const chatRef = doc(db, CLN_CHATS, chatId);
    const messagesRef = collection(chatRef, CLN_MESSAGES);
    const timestamp = new Date().toISOString();

    await addDoc(messagesRef, {
        text,
        senderId,
        createdAt: timestamp
    });

    await updateDoc(chatRef, {
        lastMessage: {
            text,
            createdAt: timestamp
        }
    });
};
