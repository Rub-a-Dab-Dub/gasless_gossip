export class CommentDto {
  content: string;
  parent_id?: number;
}

export class EditCommentDto {
  content: string;
}
