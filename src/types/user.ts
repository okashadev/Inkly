export interface User {
  id: string;
  name?: string | null;
  username?: string;
  email: string;
  image?: string | null;
  bio?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    posts: number;
    followers: number;
  };
}

export interface UserStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalFollowers: number;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string | Date;
}