export class CreateSessionDto {
  userId!: string;
  token!: string;
  expiresAt!: Date;
}