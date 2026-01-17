import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const signupUser = async (email: string, password: string, username: string) => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    const uid = userCredential.user.uid;

    // Store minimal user profile (NO personal data exposed)
    await setDoc(doc(db, "users", uid), {
        username: username,
        role: "user",
        points: 0,
        createdAt: new Date().toISOString()
    });

    return userCredential.user;
};
