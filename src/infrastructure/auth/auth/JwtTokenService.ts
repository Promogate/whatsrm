import jwt from 'jsonwebtoken';
import { TokenService } from '@core/ports/auth/TokenService';
import { Token, TokenPayload } from '@/core/domain/auth/Token';

export class JwtTokenService implements TokenService {
  constructor(
    private readonly secretKey: string,
    private readonly expiresIn: number = 3600
  ) {}

  generateToken(payload: TokenPayload): Token {
    const token = jwt.sign(payload, this.secretKey, {
      expiresIn: this.expiresIn
    });

    return {
      token,
      expiresIn: this.expiresIn
    };
  }

  verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secretKey) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}