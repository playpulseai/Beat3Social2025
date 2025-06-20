import { type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByDisplayName(displayName: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByDisplayName(displayName: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.displayName === displayName,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = Date.now().toString();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        posts: 0,
        following: 0,
        followers: 0,
      }
    };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
