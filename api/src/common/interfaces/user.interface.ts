export interface IUser {
  id: string;
  username: string;
  email?: string;
  address?: string;
  is_verified: boolean;
  photo: string;
  created_at: Date;
  updated_at: Date;
}
