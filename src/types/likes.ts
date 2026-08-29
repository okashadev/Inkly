import { Post } from "./post";

export interface LikedBlogs {
  id: string;
  postId: string;
  userId: string;
  createdAt: string | Date;
  post: Post;
}
