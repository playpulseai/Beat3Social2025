// Temporary mock authentication for development
export const mockAuth = {
  currentUser: null,
  
  signInWithEmailAndPassword: async (email: string, password: string) => {
    // Mock successful login for admin user
    if (email === "derrickshaw@playpulseai.com") {
      const mockUser = {
        uid: "admin-mock-uid",
        email: "derrickshaw@playpulseai.com",
        displayName: "Derrick Shaw",
        emailVerified: true
      };
      mockAuth.currentUser = mockUser;
      return { user: mockUser };
    }
    
    // Mock login for other users
    const mockUser = {
      uid: `mock-${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      emailVerified: true
    };
    mockAuth.currentUser = mockUser;
    return { user: mockUser };
  },

  createUserWithEmailAndPassword: async (email: string, password: string) => {
    const mockUser = {
      uid: `mock-${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      emailVerified: true
    };
    mockAuth.currentUser = mockUser;
    return { user: mockUser };
  },

  signOut: async () => {
    mockAuth.currentUser = null;
  },

  updateProfile: async (user: any, data: any) => {
    if (mockAuth.currentUser) {
      Object.assign(mockAuth.currentUser, data);
    }
  },

  onAuthStateChanged: (callback: (user: any) => void) => {
    callback(mockAuth.currentUser);
    return () => {}; // unsubscribe function
  }
};