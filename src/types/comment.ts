export type Comment = {
  id: string;
  postId: string;
  email: string;
  content: string;
  date: string;
};

export type CommentsErrors = {
  email?: string;
  body?: string;
};

export interface CommentFormProps {
  postId: string;
  comments?: Comment[];
}
