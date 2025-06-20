import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
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
