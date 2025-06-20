// Mock data for development when Firebase is unavailable
import { PostWithAuthor, User } from "@/types";

const mockUsers: User[] = [
  {
    id: "admin-mock-uid",
    email: "derrickshaw@playpulseai.com",
    displayName: "Derrick Shaw",
    role: "admin",
    isVerified: true,
    isSuspended: false,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    stats: { posts: 5, following: 12, followers: 25 },
    profilePicture: "/api/placeholder/40/40",
    bio: "Founder of Beat3 Social - Revolutionizing education through Web3"
  },
  {
    id: "user-teacher-1",
    email: "sarah.teacher@school.edu",
    displayName: "Sarah Johnson",
    role: "teacher",
    isVerified: true,
    isSuspended: false,
    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-01-02"),
    stats: { posts: 12, following: 8, followers: 15 },
    profilePicture: "/api/placeholder/40/40",
    bio: "5th Grade Teacher | AI Education Enthusiast"
  },
  {
    id: "user-parent-1",
    email: "mike.parent@gmail.com",
    displayName: "Mike Chen",
    role: "parent",
    isVerified: false,
    isSuspended: false,
    createdAt: new Date("2025-01-03"),
    updatedAt: new Date("2025-01-03"),
    stats: { posts: 3, following: 5, followers: 8 },
    profilePicture: "/api/placeholder/40/40",
    bio: "Parent of two amazing kids"
  }
];

const mockPosts: PostWithAuthor[] = [
  {
    id: "post-1",
    authorId: "admin-mock-uid",
    content: "Excited to announce Beat3 Social is now live! 🚀 This platform will revolutionize how educators connect and share knowledge. #education #edtech #web3",
    tags: ["education", "edtech", "web3"],
    author: mockUsers[0],
    mediaUrls: [],
    mediaType: "none" as const,
    likes: ["user-teacher-1", "user-parent-1"],
    shares: ["user-teacher-1"],
    comments: ["comment-1", "comment-2"],
    isModerated: false,
    isFlagged: false,
    createdAt: new Date("2025-06-19T10:00:00Z"),
    updatedAt: new Date("2025-06-19T10:00:00Z")
  },
  {
    id: "post-2",
    authorId: "user-teacher-1",
    content: "Just finished implementing a new AI-powered lesson plan generator for my classroom. The students are loving the personalized learning experience! #ai #education #teaching",
    tags: ["ai", "education", "teaching"],
    author: mockUsers[1],
    mediaUrls: [],
    mediaType: "none" as const,
    likes: ["admin-mock-uid", "user-parent-1"],
    shares: ["admin-mock-uid"],
    comments: ["comment-3"],
    isModerated: false,
    isFlagged: false,
    createdAt: new Date("2025-06-19T14:30:00Z"),
    updatedAt: new Date("2025-06-19T14:30:00Z")
  },
  {
    id: "post-3",
    authorId: "user-parent-1",
    content: "My daughter came home so excited about her coding project today. It's amazing to see how technology is being integrated into education these days! #education #coding #proud",
    tags: ["education", "coding"],
    author: mockUsers[2],
    mediaUrls: [],
    mediaType: "none" as const,
    likes: ["admin-mock-uid"],
    shares: ["user-teacher-1"],
    comments: ["comment-4", "comment-5"],
    isModerated: false,
    isFlagged: false,
    createdAt: new Date("2025-06-19T16:45:00Z"),
    updatedAt: new Date("2025-06-19T16:45:00Z")
  },
  {
    id: "post-4",
    authorId: "admin-mock-uid",
    content: "Hosting a virtual workshop on 'Integrating Blockchain in Education' next week. Who's interested in joining? We'll explore NFT certificates and decentralized learning platforms. #blockchain #education #workshop",
    tags: ["blockchain", "education", "workshop"],
    author: mockUsers[0],
    mediaUrls: [],
    mediaType: "none" as const,
    likes: ["user-teacher-1", "user-parent-1"],
    shares: ["user-teacher-1", "user-parent-1"],
    comments: ["comment-6", "comment-7", "comment-8"],
    isModerated: false,
    isFlagged: false,
    createdAt: new Date("2025-06-20T09:15:00Z"),
    updatedAt: new Date("2025-06-20T09:15:00Z")
  },
  {
    id: "post-5",
    authorId: "user-teacher-1",
    content: "Quick tip for fellow educators: Using gamification in math lessons has increased student engagement by 40% in my classroom. Simple reward systems work wonders! #teaching #gamification #math",
    tags: ["teaching", "gamification", "math"],
    author: mockUsers[1],
    mediaUrls: [],
    mediaType: "none" as const,
    likes: ["admin-mock-uid", "user-parent-1"],
    shares: ["admin-mock-uid"],
    comments: ["comment-9", "comment-10"],
    isModerated: false,
    isFlagged: false,
    createdAt: new Date("2025-06-20T11:30:00Z"),
    updatedAt: new Date("2025-06-20T11:30:00Z")
  }
];

export const getMockPosts = async (): Promise<{ posts: PostWithAuthor[]; hasMore: boolean }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    posts: mockPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    hasMore: false
  };
};

export const getMockUser = async (uid: string): Promise<User | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return mockUsers.find(user => user.id === uid) || null;
};

export const createMockPost = async (postData: any): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newPost: PostWithAuthor = {
    id: `post-${Date.now()}`,
    content: postData.content,
    tags: postData.tags || [],
    authorId: postData.authorId,
    author: mockUsers.find(u => u.id === postData.authorId) || mockUsers[0],
    mediaUrls: [],
    likes: 0,
    shares: 0,
    comments: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockPosts.unshift(newPost);
  return newPost.id;
};