import { User } from "./user";

export interface Comment {
  id: string;
  content: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  authorId: string;
  author?: User;
  postId: string;
}