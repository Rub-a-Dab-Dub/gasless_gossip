export class AuthResponseDto {
  access_token!: string;
  user!: {
    id: string;
    email: string;
    stellarAccountId?: string;
  };
}
