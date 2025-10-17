export interface IAuth {
  username: string;
  password: string;
}

export interface ILogin {
  username: string;
  password: string;
}

export interface ISignup {
  username: string;
  password: string;
  email?: string;
  address?: string;
}
