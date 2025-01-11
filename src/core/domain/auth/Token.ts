export interface TokenPayload {
  userId: string;
  email: string;
}

export interface Token {
  token: string;
  expiresIn: number;
}