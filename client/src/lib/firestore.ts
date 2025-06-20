import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { Post, InsertPost, Comment, InsertComment, ModerationLog, InsertModerationLog } from "@shared/schema";

// Posts
export const createPost = async (postData: InsertPost & { authorId: string }): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: [],
      shares: [],
      comments: [],
    });

    // Update user post count
    await updateDoc(doc(db, "users", postData.authorId), {
      "stats.posts": increment(1),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const getPosts = async (lastDoc?: QueryDocumentSnapshot<DocumentData>) => {
  try {
    let q = query(
      collection(db, "posts"),
      where("isFlagged", "==", false),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    if (lastDoc) {
      q = query(
        collection(db, "posts"),
        where("isFlagged", "==", false),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(10)
      );
    }

    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Post;
    });

    return {
      posts,
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
      hasMore: snapshot.docs.length === 10,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const likePost = async (postId: string, userId: string) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    
    if (postDoc.exists()) {
      const postData = postDoc.data();
      const likes = postData.likes || [];
      
      if (likes.includes(userId)) {
        await updateDoc(postRef, {
          likes: arrayRemove(userId),
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(userId),
        });
      }
    }
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

export const sharePost = async (postId: string, userId: string) => {
  try {
    await updateDoc(doc(db, "posts", postId), {
      shares: arrayUnion(userId),
    });
  } catch (error) {
    console.error("Error sharing post:", error);
    throw error;
  }
};

// Comments
export const addComment = async (commentData: InsertComment): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "comments"), {
      ...commentData,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: [],
    });

    // Add comment ID to post
    await updateDoc(doc(db, "posts", commentData.postId), {
      comments: arrayUnion(docRef.id),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const getComments = async (postId: string) => {
  try {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Comment;
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Moderation
export const createModerationLog = async (logData: InsertModerationLog): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "moderationLogs"), {
      ...logData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating moderation log:", error);
    throw error;
  }
};

export const flagPost = async (postId: string, reason: string) => {
  try {
    await updateDoc(doc(db, "posts", postId), {
      isFlagged: true,
      flagReason: reason,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error flagging post:", error);
    throw error;
  }
};

export const getFlaggedPosts = async () => {
  try {
    const q = query(
      collection(db, "posts"),
      where("isFlagged", "==", true),
      orderBy("updatedAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Post;
    });
  } catch (error) {
    console.error("Error fetching flagged posts:", error);
    throw error;
  }
};

// Admin functions
export const getAllUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const verifyUser = async (userId: string) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      isVerified: true,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    throw error;
  }
};

export const suspendUser = async (userId: string) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      isSuspended: true,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error suspending user:", error);
    throw error;
  }
};
