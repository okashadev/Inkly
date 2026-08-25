import { Category } from "./category";
import { User } from "./user";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  description?: string | null;
  coverImage?: string | null;
  readingTime: number;
  published: boolean;
  views: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  authorId: string;
  author?: User;
  categoryId?: string | null;
  category?: Category | null;
  _count?: {
    likes: number;
    comments?: number;
  };
}

export interface RecentPostsProps {
  posts: Post[] | null;
}
