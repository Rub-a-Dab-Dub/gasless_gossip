export class UpdateProfileDto {
  photo?: string;
  address?: string;
  title?: string;
  about?: string;
}

export class ChangePasswordDto {
  old_password: string;
  new_password: string;
}
