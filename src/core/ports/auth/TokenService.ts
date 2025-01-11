import { Token, TokenPayload } from "@/core/domain/auth/Token";

export interface TokenService {
  generateToken(payload: TokenPayload): Token;
  verifyToken(token: string): TokenPayload;
}