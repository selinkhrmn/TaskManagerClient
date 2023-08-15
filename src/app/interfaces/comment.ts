export interface Comment{
    id: number;
    taskId: number;
    comment: string;
    rewrite: boolean;
    createdByUser: string;
    createdDate: Date;
    updatedDate: Date;
}

export interface CommentRequest{
    id: number;
    comment: string;
}