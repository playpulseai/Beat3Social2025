import React, { createContext, useContext, useEffect, useState } from "react";
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

// Simple session-based authentication
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('beat3_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const setStoredUser = (user: any) => {
  if (user) {
    localStorage.setItem('beat3_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('beat3_user');
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setUserData(storedUser.userData);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simple authentication - create user session
      const mockUser = {
        uid: email === "derrickshaw@playpulseai.com" ? "admin-mock-uid" : `user-${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        emailVerified: true
      };
      
      const mockUserData: User = {
        id: mockUser.uid,
        email,
        displayName: mockUser.displayName,
        role: email === "derrickshaw@playpulseai.com" ? "admin" : "teacher",
        isVerified: email === "derrickshaw@playpulseai.com",
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        stats: { posts: 0, following: 0, followers: 0 },
        bio: email === "derrickshaw@playpulseai.com" 
          ? "Founder of Beat3 Social - Where AI meets education. Revolutionizing learning through Web3 technology."
          : "Educator passionate about integrating AI and technology in learning."
      };
      
      const sessionData = { ...mockUser, userData: mockUserData };
      
      setUser(mockUser);
      setUserData(mockUserData);
      setStoredUser(sessionData);
      setLoading(false);
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
      // Simple registration - create user session
      const mockUser = {
        uid: email === "derrickshaw@playpulseai.com" ? "admin-mock-uid" : `user-${Date.now()}`,
        email,
        displayName,
        emailVerified: true
      };
      
      const mockUserData: User = {
        id: mockUser.uid,
        email,
        displayName,
        role: role as any,
        isVerified: email === "derrickshaw@playpulseai.com",
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        stats: { posts: 0, following: 0, followers: 0 },
        workEmail,
        bio: email === "derrickshaw@playpulseai.com" 
          ? "Founder of Beat3 Social - Where AI meets education. Revolutionizing learning through Web3 technology."
          : ""
      };
      
      const sessionData = { ...mockUser, userData: mockUserData };
      
      setUser(mockUser);
      setUserData(mockUserData);
      setStoredUser(sessionData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    setUserData(null);
    setStoredUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (user && userData) {
      const updatedUserData = { ...userData, ...data };
      setUserData(updatedUserData);
      const sessionData = { ...user, userData: updatedUserData };
      setStoredUser(sessionData);
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
