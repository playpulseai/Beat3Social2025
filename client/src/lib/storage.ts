import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size exceeds 10MB limit");
    }
    
    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      throw new Error("Invalid file type. Only images and videos are allowed");
    }
    
    // Try Firebase Storage first if available
    if (storage) {
      try {
        const { auth } = await import('./firebase');
        if (auth?.currentUser) {
          console.log("Attempting Firebase Storage upload...");
          const storageRef = ref(storage, path);
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          console.log("Firebase Storage upload successful:", downloadURL);
          return downloadURL;
        }
      } catch (firebaseError) {
        console.warn("Firebase Storage upload failed, using fallback:", firebaseError);
      }
    }
    
    // Fallback to server-side upload endpoint
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Server upload failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log("Server upload successful:", result.url);
    return result.url;
    
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const uploadProfilePicture = async (file: File, userId: string): Promise<string> => {
  const path = `profile-pictures/${userId}/${Date.now()}-${file.name}`;
  return uploadFile(file, path);
};

export const uploadBannerImage = async (file: File, userId: string): Promise<string> => {
  const path = `banner-images/${userId}/${Date.now()}-${file.name}`;
  return uploadFile(file, path);
};

export const uploadPostMedia = async (file: File, userId: string, postId: string): Promise<string> => {
  const path = `post-media/${userId}/${postId}/${Date.now()}-${file.name}`;
  return uploadFile(file, path);
};

export const deleteFile = async (url: string): Promise<void> => {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
