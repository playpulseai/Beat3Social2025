import { z } from "zod";

// User Types
export const UserRole = z.enum(["teacher", "parent", "educator", "admin"]);

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  role: UserRole,
  isVerified: z.boolean().default(false),
  profilePicture: z.string().optional(),
  bannerImage: z.string().optional(),
  bio: z.string().optional(),
  workEmail: z.string().email().optional(),
  isSuspended: z.boolean().optional().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  stats: z.object({
    posts: z.number().default(0),
    following: z.number().default(0),
    followers: z.number().default(0),
  }).default({
    posts: 0,
    following: 0,
    followers: 0,
  }),
});

export const InsertUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  stats: true,
});

// Post Types
export const PostSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  content: z.string(),
  mediaUrls: z.array(z.string()).default([]),
  mediaType: z.enum(["image", "video", "none"]).default("none"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  likes: z.array(z.string()).default([]),
  shares: z.array(z.string()).default([]),
  comments: z.array(z.string()).default([]),
  isModerated: z.boolean().default(false),
  isFlagged: z.boolean().default(false),
  flagReason: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const InsertPostSchema = PostSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likes: true,
  shares: true,
  comments: true,
});

// Comment Types
export const CommentSchema = z.object({
  id: z.string(),
  postId: z.string(),
  authorId: z.string(),
  content: z.string(),
  likes: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const InsertCommentSchema = CommentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likes: true,
});

// NFT Types (Preparation only)
export const NFTSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(["test-score", "certificate", "milestone"]),
  metadata: z.record(z.any()),
  isMinted: z.boolean().default(false),
  mintingFee: z.number().default(0.007), // ETH
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const InsertNFTSchema = NFTSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isMinted: true,
});

// Moderation Types
export const ModerationLogSchema = z.object({
  id: z.string(),
  postId: z.string(),
  agentType: z.enum(["content-relevance", "safety-monitoring"]),
  action: z.enum(["flagged", "approved", "removed"]),
  reason: z.string(),
  confidence: z.number().min(0).max(1),
  createdAt: z.date(),
});

export const InsertModerationLogSchema = ModerationLogSchema.omit({
  id: true,
  createdAt: true,
});

// Trending Topics
export const TrendingTopicSchema = z.object({
  id: z.string(),
  tag: z.string(),
  postCount: z.number(),
  status: z.enum(["trending", "rising", "stable"]),
  updatedAt: z.date(),
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type InsertUser = z.infer<typeof InsertUserSchema>;
export type Post = z.infer<typeof PostSchema>;
export type InsertPost = z.infer<typeof InsertPostSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type InsertComment = z.infer<typeof InsertCommentSchema>;
export type NFT = z.infer<typeof NFTSchema>;
export type InsertNFT = z.infer<typeof InsertNFTSchema>;
export type ModerationLog = z.infer<typeof ModerationLogSchema>;
export type InsertModerationLog = z.infer<typeof InsertModerationLogSchema>;
export type TrendingTopic = z.infer<typeof TrendingTopicSchema>;
export type UserRole = z.infer<typeof UserRole>;
