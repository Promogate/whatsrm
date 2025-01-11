// src/tests/usecases/auth/AuthenticateCustomerUseCase.test.ts
import { CustomerRepository } from '@core/ports/repositories/CustomerRepository';
import { TokenService } from '@core/ports/auth/TokenService';
import { Customer } from '@core/domain/Customer';
import sinon from 'sinon';
import { AuthenticateCustomerUseCase } from '@/core/auth/AuthenticateCustomerUseCase';
import { FirestoreCustomerRepository } from '@/infrastructure/repositories/FirestoreCustomerRepository';
import { JwtTokenService } from '@/infrastructure/auth/auth/JwtTokenService';

describe('AuthenticateCustomerUseCase', () => {
  let customerRepository: sinon.SinonStubbedInstance<CustomerRepository>;
  let tokenService: sinon.SinonStubbedInstance<TokenService>;
  let authenticateCustomerUseCase: AuthenticateCustomerUseCase;

  // Mock data
  const mockCustomer = Customer.create({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  });

  const mockToken = {
    token: 'mock.jwt.token',
    expiresIn: 3600
  };

  beforeEach(() => {
    // Criar stubs para as dependências
    customerRepository = sinon.createStubInstance(FirestoreCustomerRepository);
    tokenService = sinon.createStubInstance(JwtTokenService);

    // Instanciar o caso de uso com as dependências mockadas
    authenticateCustomerUseCase = new AuthenticateCustomerUseCase(
      customerRepository,
      tokenService
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('execute', () => {
    it('should authenticate user and return token when credentials are valid', async () => {
      // Arrange
      const credentials = {
        email: 'john@example.com',
        password: 'password123'
      };

      customerRepository.findByEmail.resolves(mockCustomer);
      tokenService.generateToken.returns(mockToken);

      // Act
      const result = await authenticateCustomerUseCase.execute(credentials);

      // Assert
      expect(result).toEqual(mockToken);
      
      // Usando sinon.assert para verificar as chamadas
      sinon.assert.calledWith(customerRepository.findByEmail, credentials.email);
      sinon.assert.calledWith(tokenService.generateToken, {
        userId: mockCustomer.getId(),
        email: mockCustomer.getEmail()
      });
    });

    it('should throw error when user is not found', async () => {
      // Arrange
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      customerRepository.findByEmail.resolves(null);

      // Act & Assert
      await expect(authenticateCustomerUseCase.execute(credentials))
        .rejects
        .toThrow('Invalid credentials');
      
      // Usando sinon.assert para verificar as chamadas
      sinon.assert.calledWith(customerRepository.findByEmail, credentials.email);
      sinon.assert.notCalled(tokenService.generateToken);
    });
  });
});