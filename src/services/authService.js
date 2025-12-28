import { auth, db, storage } from "../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile as updateAuthProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const registerUser = async ({ email, password, name, department, year, role = 'student' }) => {
    try {
        console.log("Attempting to create user in Auth...");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Auth User created:", user.uid);

        await updateAuthProfile(user, { displayName: name });

        // Determine role based on email
        const assignedRole = email === 'admin@scc.com' ? 'admin' : 'student';

        const userProfile = {
            uid: user.uid,
            name,
            email,
            department,
            year,
            role: assignedRole,
            createdAt: new Date().toISOString()
        };

        console.log("Writing user profile to Firestore...");
        await setDoc(doc(db, "users", user.uid), userProfile);
        console.log("Firestore profile written successfully.");

        return { user, userProfile };
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        let userProfile = null;
        if (docSnap.exists()) {
            userProfile = docSnap.data();
        }
        return { user, userProfile };
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};

export const updateUserProfile = async (userId, data, imageUri) => {
    try {
        let photoURL = null;

        // 1. Upload Image if provided
        if (imageUri) {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const storageRef = ref(storage, `profile_pictures/${userId}`);
            await uploadBytes(storageRef, blob);
            photoURL = await getDownloadURL(storageRef);
        }

        // 2. Prepare Update Data
        const updateData = {
            ...data
        };
        if (photoURL) {
            updateData.photoURL = photoURL;
        }

        // 3. Update Firestore
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, updateData);

        // 4. Update Auth Profile (if name or photo changed)
        const currentUser = auth.currentUser;
        if (currentUser) {
            await updateAuthProfile(currentUser, {
                displayName: data.name,
                photoURL: photoURL || currentUser.photoURL
            });
        }

        return updateData;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};
