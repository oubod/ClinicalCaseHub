export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          firstName: string
          lastName: string
          specialty: string
          role?: string
          hospital?: string
          department?: string
          bio?: string
          profileImageUrl?: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          email: string
          firstName: string
          lastName: string
          specialty: string
          role?: string
          hospital?: string
          department?: string
          bio?: string
          profileImageUrl?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          email?: string
          firstName?: string
          lastName?: string
          specialty?: string
          role?: string
          hospital?: string
          department?: string
          bio?: string
          profileImageUrl?: string | null
          updatedAt?: string
        }
      }
      cases: {
        Row: {
          id: string
          title: string
          description: string
          authorId: string
          specialty: string
          status: 'active' | 'resolved' | 'review'
          priority: 'low' | 'normal' | 'high' | 'urgent'
          patientAge: string
          patientGender: 'male' | 'female' | 'other'
          diagnosis?: string
          treatment?: string
          outcome?: string
          tags: string[]
          viewCount: number
          featured: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          title: string
          description: string
          authorId: string
          specialty: string
          status?: 'active' | 'resolved' | 'review'
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          patientAge: string
          patientGender: 'male' | 'female' | 'other'
          diagnosis?: string
          treatment?: string
          outcome?: string
          tags?: string[]
          viewCount?: number
          featured?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          title?: string
          description?: string
          specialty?: string
          status?: 'active' | 'resolved' | 'review'
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          patientAge?: string
          patientGender?: 'male' | 'female' | 'other'
          diagnosis?: string
          treatment?: string
          outcome?: string
          tags?: string[]
          viewCount?: number
          featured?: boolean
          updatedAt?: string
        }
      }
      comments: {
        Row: {
          id: string
          caseId: string
          authorId: string
          content: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          caseId: string
          authorId: string
          content: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          content?: string
          updatedAt?: string
        }
      }
      attachments: {
        Row: {
          id: string
          caseId: string
          url: string
          name: string
          type: string
          size: number
          createdAt: string
          updatedAt: string
        }
        Insert: {
          caseId: string
          url: string
          name: string
          type: string
          size: number
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          url?: string
          name?: string
          type?: string
          size?: number
          updatedAt?: string
        }
      }
    }
  }
} 