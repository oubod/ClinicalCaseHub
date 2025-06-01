import {
  users,
  cases,
  comments,
  type User,
  type UpsertUser,
  type Case,
  type CaseWithAuthor,
  type CaseWithDetails,
  type InsertCase,
  type InsertComment,
  type CommentWithAuthor,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, ilike, and, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Case operations
  getCases(filters?: {
    specialty?: string;
    status?: string;
    tags?: string[];
    search?: string;
  }): Promise<CaseWithAuthor[]>;
  getCase(id: number): Promise<CaseWithDetails | undefined>;
  createCase(caseData: InsertCase): Promise<Case>;
  updateCase(id: number, caseData: Partial<InsertCase>): Promise<Case | undefined>;
  
  // Comment operations
  createComment(commentData: InsertComment): Promise<CommentWithAuthor>;
  getComments(caseId: number): Promise<CommentWithAuthor[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Case operations
  async getCases(filters?: {
    specialty?: string;
    status?: string;
    tags?: string[];
    search?: string;
  }): Promise<CaseWithAuthor[]> {
    const query = db
      .select({
        id: cases.id,
        title: cases.title,
        description: cases.description,
        authorId: cases.authorId,
        specialty: cases.specialty,
        status: cases.status,
        priority: cases.priority,
        patientAge: cases.patientAge,
        patientGender: cases.patientGender,
        diagnosis: cases.diagnosis,
        treatment: cases.treatment,
        outcome: cases.outcome,
        tags: cases.tags,
        attachments: cases.attachments,
        viewCount: cases.viewCount,
        featured: cases.featured,
        createdAt: cases.createdAt,
        updatedAt: cases.updatedAt,
        author: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          specialty: users.specialty,
          role: users.role,
          hospital: users.hospital,
          department: users.department,
          bio: users.bio,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
      })
      .from(cases)
      .innerJoin(users, eq(cases.authorId, users.id))
      .orderBy(desc(cases.createdAt));

    const conditions = [];

    if (filters?.specialty && filters.specialty !== "All Specialties") {
      conditions.push(eq(cases.specialty, filters.specialty));
    }

    if (filters?.status && filters.status !== "All Status") {
      conditions.push(eq(cases.status, filters.status));
    }

    if (filters?.search) {
      conditions.push(ilike(cases.title, `%${filters.search}%`));
    }

    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }

    return await query;
  }

  async getCase(id: number): Promise<CaseWithDetails | undefined> {
    const [caseData] = await db
      .select({
        id: cases.id,
        title: cases.title,
        description: cases.description,
        authorId: cases.authorId,
        specialty: cases.specialty,
        status: cases.status,
        priority: cases.priority,
        patientAge: cases.patientAge,
        patientGender: cases.patientGender,
        diagnosis: cases.diagnosis,
        treatment: cases.treatment,
        outcome: cases.outcome,
        tags: cases.tags,
        attachments: cases.attachments,
        viewCount: cases.viewCount,
        featured: cases.featured,
        createdAt: cases.createdAt,
        updatedAt: cases.updatedAt,
        author: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          specialty: users.specialty,
          role: users.role,
          hospital: users.hospital,
          department: users.department,
          bio: users.bio,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
      })
      .from(cases)
      .innerJoin(users, eq(cases.authorId, users.id))
      .where(eq(cases.id, id));

    if (!caseData) return undefined;

    const caseComments = await this.getComments(id);

    return {
      ...caseData,
      comments: caseComments,
    };
  }

  async createCase(caseData: InsertCase): Promise<Case> {
    const [newCase] = await db.insert(cases).values(caseData).returning();
    return newCase;
  }

  async updateCase(id: number, caseData: Partial<InsertCase>): Promise<Case | undefined> {
    const [updatedCase] = await db
      .update(cases)
      .set({ ...caseData, updatedAt: new Date() })
      .where(eq(cases.id, id))
      .returning();
    return updatedCase;
  }

  // Comment operations
  async createComment(commentData: InsertComment): Promise<CommentWithAuthor> {
    const [newComment] = await db.insert(comments).values(commentData).returning();
    
    const [commentWithAuthor] = await db
      .select({
        id: comments.id,
        caseId: comments.caseId,
        authorId: comments.authorId,
        content: comments.content,
        createdAt: comments.createdAt,
        author: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          specialty: users.specialty,
          role: users.role,
          hospital: users.hospital,
          department: users.department,
          bio: users.bio,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
      })
      .from(comments)
      .innerJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.id, newComment.id));

    return commentWithAuthor;
  }

  async getComments(caseId: number): Promise<CommentWithAuthor[]> {
    return await db
      .select({
        id: comments.id,
        caseId: comments.caseId,
        authorId: comments.authorId,
        content: comments.content,
        createdAt: comments.createdAt,
        author: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          specialty: users.specialty,
          role: users.role,
          hospital: users.hospital,
          department: users.department,
          bio: users.bio,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
      })
      .from(comments)
      .innerJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.caseId, caseId))
      .orderBy(desc(comments.createdAt));
  }
}

export const storage = new DatabaseStorage();