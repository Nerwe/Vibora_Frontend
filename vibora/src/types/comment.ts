export interface Comment {
    id: string;
    userID: string;
    postID: string;
    content: string;
    score: number;
    createdDate: string;
    isHidden: boolean;
    isDeleted: boolean;
  }