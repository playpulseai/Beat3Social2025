import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { User, InsertUser } from "@shared/schema";

export interface AuthUser extends FirebaseUser {
  userData?: User;
}

export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  role: "teacher" | "parent" | "educator",
  workEmail?: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName,
    });

    const userData: InsertUser = {
      email,
      displayName,
      role,
      workEmail,
      isVerified: false,
    };

    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        posts: 0,
        following: 0,
        followers: 0,
      },
    });

    return user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const getUserData = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: uid,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as User;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const updateUserData = async (uid: string, data: Partial<User>) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

export const isAdmin = (user: User | null): boolean => {
  return user?.email === "derrickshaw@playpulseai.com" || user?.role === "admin";
};
