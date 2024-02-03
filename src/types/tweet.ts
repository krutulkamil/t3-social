export interface Tweet {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  likedByMe: boolean;
}