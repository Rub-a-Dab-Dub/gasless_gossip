export class AuthDto {
  username: string;
  password: string;
}

export class LoginDto {
  username: string;
  password: string;
}

export class SignupDto {
  username: string;
  password: string;
  email?: string;
  address?: string;
}

