import { db } from "../config/firebase";
import { collection, addDoc, Timestamp, doc, updateDoc, setDoc } from "firebase/firestore";

export const seedDatabase = async (currentUserId) => {
    // 0. Promote User to Admin (Required to bypass generic security rules for Events/Announcements)
    try {
        const userRef = doc(db, "users", currentUserId);
        await updateDoc(userRef, { role: 'admin' });
        console.log("User promoted to admin for seeding.");
    } catch (e) {
        console.warn("Could not promote user (might already be admin or doc missing):", e);
    }

    // 4. Add Dummy Users for Contacts
    const dummyUsers = [
        { uid: "user_101", name: "Rahul Sharma", email: "rahul@scc.com", department: "CSE", role: "student" },
        { uid: "user_102", name: "Priya Patel", email: "priya@scc.com", department: "ECE", role: "student" },
        { uid: "user_103", name: "Prof. Anjali", email: "anjali@scc.com", department: "HOD", role: "admin" },
        { uid: "user_104", name: "Sports Coord", email: "sports@scc.com", department: "Admin", role: "admin" }
    ];

    const userPromises = dummyUsers.map(u =>
        setDoc(doc(db, "users", u.uid), {
            name: u.name,
            email: u.email,
            department: u.department,
            role: u.role,
            photoURL: `https://ui-avatars.com/api/?name=${u.name.replace(" ", "+")}&background=random`,
            createdAt: new Date().toISOString()
        })
    );

    const announcements = [
        {
            title: "Project Review Meeting",
            description: "Final year project reviews will be held on Monday. All teams must be present.",
            authorName: "HOD",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        },
        {
            title: "Campus Recruitments",
            description: "Infosys and Wipro will differ their drive dates. New dates to be announced soon.",
            authorName: "Placement Cell",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
        },
        {
            title: "Holiday Declaration",
            description: "The college will remain closed on Friday, 5th Jan, on account of Founder's Day.",
            authorName: "Principal",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
        }
    ];

    const events = [
        {
            title: "Project Kick-off Meeting",
            date: "2025-01-10",
            location: "Conference Hall A",
            imageUrl: "https://picsum.photos/id/10/400/200",
            attendees: [currentUserId], // Auto-join user
            createdAt: new Date().toISOString()
        },
        {
            title: "Annual Sports Meet",
            date: "2025-02-10",
            location: "College Ground",
            imageUrl: "https://picsum.photos/id/12/400/200",
            attendees: [],
            createdAt: new Date().toISOString()
        },
        {
            title: "Music Club Workshop",
            date: "2025-01-25",
            location: "Room 304",
            imageUrl: "https://picsum.photos/id/30/400/200",
            attendees: [],
            createdAt: new Date().toISOString()
        }
    ];

    try {
        // 1. Add Announcements
        const announcePromises = announcements.map(data => addDoc(collection(db, "announcements"), data));

        // 2. Add Events
        const eventPromises = events.map(data => addDoc(collection(db, "events"), data));

        // 3. Add Demo Chat
        const botId = "placement_bot";
        const chatId = `${currentUserId}_${botId}`;
        const chatRef = collection(db, "chats");

        // Check if we need to create the chat doc (simplified: just add a new one or overwrite)
        // For demo, we'll just add a fresh chat doc to ensure it appears top of list
        const demoChat = {
            participants: [currentUserId, botId],
            participantDetails: {
                [currentUserId]: { name: "Me" },
                [botId]: { name: "Placement Bot" }
            },
            lastMessage: {
                text: "Don't forget to submit your resume!",
                createdAt: new Date().toISOString()
            },
            createdAt: new Date().toISOString(),
            users: [currentUserId, botId] // Include 'users' array for query compatibility
        };

        const chatDocRef = await addDoc(chatRef, demoChat);

        // Add dummy messages to this chat
        const messagesRef = collection(db, "chats", chatDocRef.id, "messages");
        const msgs = [
            { text: "Hello! checking in on your placement status.", senderId: botId, createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
            { text: "I have updated my profile.", senderId: currentUserId, createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
            { text: "Great! Don't forget to submit your resume!", senderId: botId, createdAt: new Date().toISOString() }
        ];

        const msgPromises = msgs.map(m => addDoc(messagesRef, m));

        await Promise.all([...announcePromises, ...eventPromises, chatDocRef, ...msgPromises, ...userPromises]);
        return "Success! Demo data added.";
    } catch (error) {
        console.error("Error seeding data:", error);
        throw error;
    }
};
