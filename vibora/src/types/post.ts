export interface Post {
    id: string;
    userID: string;
    threadID: string;
    title: string;
    content: string;
    score: number;
    createdDate: string;
    lastUpdateDate: string;
    isHidden: boolean;
    isDeleted: boolean;
  }