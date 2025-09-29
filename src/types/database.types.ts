export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          bio: string | null;
          points: number;
          level: number;
          badges: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          points?: number;
          level?: number;
          badges?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          points?: number;
          level?: number;
          badges?: string[];
          updated_at?: string;
        };
      };
      kits: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          currency: string;
          images: string[];
          category: string;
          difficulty: string;
          age_group: string;
          components: string[];
          learning_outcomes: string[];
          estimated_hours: number;
          rating: number;
          review_count: number;
          in_stock: boolean;
          course_id: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          price: number;
          currency?: string;
          images: string[];
          category: string;
          difficulty: string;
          age_group: string;
          components: string[];
          learning_outcomes: string[];
          estimated_hours: number;
          rating?: number;
          review_count?: number;
          in_stock?: boolean;
          course_id?: string | null;
          tags: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          price?: number;
          currency?: string;
          images?: string[];
          category?: string;
          difficulty?: string;
          age_group?: string;
          components?: string[];
          learning_outcomes?: string[];
          estimated_hours?: number;
          rating?: number;
          review_count?: number;
          in_stock?: boolean;
          course_id?: string | null;
          tags?: string[];
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          kit_id: string;
          modules: any[];
          total_lessons: number;
          total_duration: number;
          difficulty: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          kit_id: string;
          modules: any[];
          total_lessons?: number;
          total_duration?: number;
          difficulty: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          kit_id?: string;
          modules?: any[];
          total_lessons?: number;
          total_duration?: number;
          difficulty?: string;
          updated_at?: string;
        };
      };
      threads: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          kit_id: string | null;
          created_by: string;
          created_at: string;
          post_count: number;
          participant_count: number;
          last_activity: string;
          tags: string[];
          is_pinned: boolean;
          is_locked: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: string;
          kit_id?: string | null;
          created_by: string;
          created_at?: string;
          post_count?: number;
          participant_count?: number;
          last_activity?: string;
          tags: string[];
          is_pinned?: boolean;
          is_locked?: boolean;
        };
        Update: {
          title?: string;
          description?: string;
          category?: string;
          kit_id?: string | null;
          post_count?: number;
          participant_count?: number;
          last_activity?: string;
          tags?: string[];
          is_pinned?: boolean;
          is_locked?: boolean;
        };
      };
      posts: {
        Row: {
          id: string;
          thread_id: string;
          user_id: string;
          content: string;
          media_urls: string[];
          post_type: string;
          parent_post_id: string | null;
          likes_count: number;
          reply_count: number;
          is_helpful: boolean;
          created_at: string;
          updated_at: string;
          tags: string[];
        };
        Insert: {
          id?: string;
          thread_id: string;
          user_id: string;
          content: string;
          media_urls: string[];
          post_type: string;
          parent_post_id?: string | null;
          likes_count?: number;
          reply_count?: number;
          is_helpful?: boolean;
          created_at?: string;
          updated_at?: string;
          tags: string[];
        };
        Update: {
          content?: string;
          media_urls?: string[];
          post_type?: string;
          likes_count?: number;
          reply_count?: number;
          is_helpful?: boolean;
          updated_at?: string;
          tags?: string[];
        };
      };
    };
  };
}

// Application Types
export interface Kit {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: 'Electronics' | 'Robotics' | 'Programming' | 'Science';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  age_group: string;
  components: string[];
  learning_outcomes: string[];
  estimated_hours: number;
  rating: number;
  review_count: number;
  in_stock: boolean;
  course_id?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Thread {
  id: string;
  title: string;
  description: string;
  category: 'kit-specific' | 'general' | 'project-showcase' | 'q-and-a';
  kit_id?: string;
  created_by: string;
  created_at: string;
  post_count: number;
  participant_count: number;
  last_activity: string;
  tags: string[];
  is_pinned: boolean;
  is_locked: boolean;
}

export interface Post {
  id: string;
  thread_id: string;
  user_id: string;
  content: string;
  media_urls: string[];
  post_type: 'question' | 'answer' | 'project' | 'discussion';
  parent_post_id?: string;
  likes_count: number;
  reply_count: number;
  is_helpful: boolean;
  created_at: string;
  updated_at: string;
  tags: string[];
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  points: number;
  level: number;
  badges: string[];
  created_at: string;
  updated_at: string;
}