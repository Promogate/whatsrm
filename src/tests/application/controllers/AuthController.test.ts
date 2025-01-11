// src/tests/application/controllers/AuthController.test.ts
import { AuthController } from '@/application/controllers/AuthController';
import { AuthenticateCustomerUseCase } from '@/core/auth/AuthenticateCustomerUseCase';
import { ExpressAdapter } from '@/infrastructure/http/ExpressAdapter';
import { HttpRequest } from '@core/ports/http/HttpServer';
import sinon from 'sinon';

describe('AuthController', () => {
  let httpServer: sinon.SinonStubbedInstance<ExpressAdapter>;
  let authenticateCustomerUseCase: sinon.SinonStubbedInstance<AuthenticateCustomerUseCase>;
  let authController: AuthController;

  beforeEach(() => {
    httpServer = sinon.createStubInstance(ExpressAdapter);
    authenticateCustomerUseCase = sinon.createStubInstance(AuthenticateCustomerUseCase);
    
    authController = new AuthController(
      httpServer,
      authenticateCustomerUseCase
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('login', () => {
    it('should return token when authentication succeeds', async () => {
      const request: HttpRequest = {
        body: {
          email: 'john@example.com',
          password: 'password123'
        },
        headers: {},
        params: {},
        query: {}
      };

      const mockToken = {
        token: 'mock.jwt.token',
        expiresIn: 3600
      };

      authenticateCustomerUseCase.execute.resolves(mockToken);

      const response = await (authController as any).login(request);

      expect(response).toEqual({
        statusCode: 200,
        body: mockToken
      });
      
      sinon.assert.calledWith(authenticateCustomerUseCase.execute, request.body);
    });

    it('should return 401 when authentication fails', async () => {
      const request: HttpRequest = {
        body: {
          email: 'wrong@example.com',
          password: 'wrongpass'
        },
        headers: {},
        params: {},
        query: {}
      };

      authenticateCustomerUseCase.execute.rejects(new Error('Invalid credentials'));

      const response = await (authController as any).login(request);

      expect(response).toEqual({
        statusCode: 401,
        body: { error: 'Invalid credentials' }
      });
      
      sinon.assert.calledWith(authenticateCustomerUseCase.execute, request.body);
    });
  });
});