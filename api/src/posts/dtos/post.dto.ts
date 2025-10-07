export class CreatePostDto {
  content: string;
  medias?: string[];
}

export class EditPostDto {
  content?: string;
  medias?: string[];
}