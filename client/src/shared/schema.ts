import { z } from "zod";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  specialty: string;
  role?: string;
  hospital?: string;
  department?: string;
  bio?: string;
  profileImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  caseId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author?: User;
}

export interface Attachment {
  id: string;
  caseId: string;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  authorId: string;
  specialty: string;
  status: 'active' | 'resolved' | 'review';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  patientAge: string;
  patientGender: 'male' | 'female' | 'other';
  diagnosis?: string;
  treatment?: string;
  outcome?: string;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  viewCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CaseWithAuthor extends Case {
  author: User;
}

export interface CaseWithDetails extends CaseWithAuthor {
  comments: Comment[];
}

export const insertCaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  specialty: z.string().min(1, "Specialty is required"),
  status: z.enum(["active", "resolved", "review"]),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  patientAge: z.string().min(1, "Patient age is required"),
  patientGender: z.enum(["male", "female", "other"]),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  outcome: z.string().optional(),
  tags: z.array(z.string()),
  attachments: z.array(z.object({
    url: z.string(),
    name: z.string(),
    type: z.string(),
    size: z.number(),
  })),
});

export const insertCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
}); 