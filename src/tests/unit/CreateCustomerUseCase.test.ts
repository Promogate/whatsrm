import { CreateCustomerUseCase } from '@core/usecases/CreateCustomerUseCase';
import { CustomerRepository } from '@core/ports/repositories/CustomerRepository';
import sinon from 'sinon';
import { Customer } from '@/core/domain/Customer';
import { FirestoreCustomerRepository } from '@/infrastructure/repositories/FirestoreCustomerRepository';

describe('CreateCustomerUseCase', () => {
  let customerRepository: sinon.SinonStubbedInstance<CustomerRepository>;
  let createCustomerUseCase: CreateCustomerUseCase;

  beforeEach(() => {
    customerRepository = sinon.createStubInstance(FirestoreCustomerRepository);

    createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
  });

  it('should create a new customer successfully', async () => {
    const customerData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      phone: '+1234567890'
    };
    customerRepository.findByEmail.resolves(null);

    const customer = await createCustomerUseCase.execute(customerData);

    expect(customer.getName()).toBe(customerData.name);
    expect(customer.getEmail()).toBe(customerData.email);
    expect(customer.getPhone()).toBe(customerData.phone);
    sinon.assert.calledOnce(customerRepository.save);
  });

  it('should throw error when customer email already exists', async () => {
    // Arrange
    const customerData = {
      name: 'John Doe',
      email: 'existing@example.com',
      password: '123456'
    };
    customerRepository.findByEmail.resolves(Customer.create({ 
      name: 'Existing user', 
      email: customerData.email,
      password: '123456'
    }));

    // Act & Assert
    await expect(createCustomerUseCase.execute(customerData))
      .rejects
      .toThrow('Customer with this email already exists');

    sinon.assert.notCalled(customerRepository.save);
  });
});