import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    if (!storage) {
      throw new Error("Firebase Storage not initialized");
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size exceeds 10MB limit");
    }
    
    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      throw new Error("Invalid file type. Only images and videos are allowed");
    }
    
    const storageRef = ref(storage, path);
    console.log("Uploading file to path:", path);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log("File uploaded successfully:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
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
