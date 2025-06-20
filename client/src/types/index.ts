export * from "@shared/schema";

import type { Post, User, Comment } from "@shared/schema";

export interface AuthContextType {
  user: any;
  userData: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, role: string, workEmail?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

export interface PostWithAuthor extends Post {
  author: User;
}

export interface CommentWithAuthor extends Comment {
  author: User;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CreatePostData {
  content: string;
  tags: string[];
  mediaFiles: File[];
}

export interface NFTMintData {
  title: string;
  description: string;
  type: "test-score" | "certificate" | "milestone";
  metadata: Record<string, any>;
}

export interface AdminStats {
  totalUsers: number;
  verifiedTeachers: number;
  postsToday: number;
  flaggedContent: number;
}

export interface TrendingTag {
  tag: string;
  postCount: number;
  status: "trending" | "rising" | "stable";
}
