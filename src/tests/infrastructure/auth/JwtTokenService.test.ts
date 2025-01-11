import { JwtTokenService } from '@/infrastructure/auth/auth/JwtTokenService';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';

describe('JwtTokenService', () => {
  const secretKey = 'test-secret';
  const expiresIn = 3600;
  let jwtTokenService: JwtTokenService;

  beforeEach(() => {
    jwtTokenService = new JwtTokenService(secretKey, expiresIn);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = {
        userId: '123',
        email: 'john@example.com'
      };

      const result = jwtTokenService.generateToken(payload);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('expiresIn', expiresIn);
      
      const decoded = jwt.verify(result.token, secretKey) as any;
      expect(decoded).toMatchObject(payload);
    });
  });

  describe('verifyToken', () => {
    it('should verify and return payload for valid token', () => {
      const payload = {
        userId: '123',
        email: 'john@example.com'
      };
      const token = jwt.sign(payload, secretKey);

      const result = jwtTokenService.verifyToken(token);

      expect(result).toMatchObject(payload);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token';

      expect(() => jwtTokenService.verifyToken(invalidToken))
        .toThrow('Invalid token');
    });
  });
});