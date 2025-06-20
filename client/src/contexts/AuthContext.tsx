import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserData, registerUser, loginUser, logoutUser, updateUserData } from "@/lib/auth";
import { User } from "@shared/schema";
import { AuthContextType } from "@/types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const userData = await getUserData(firebaseUser.uid);
        setUserData(userData);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await loginUser(email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
    role: string,
    workEmail?: string
  ) => {
    setLoading(true);
    try {
      await registerUser(email, password, displayName, role as any, workEmail);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      await updateUserData(user.uid, data);
      const updatedUserData = await getUserData(user.uid);
      setUserData(updatedUserData);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
