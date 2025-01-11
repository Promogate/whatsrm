import { CreateCustomerUseCase } from '@core/usecases/CreateCustomerUseCase';
import { CustomerRepository } from '@core/ports/repositories/CustomerRepository';
import { MessageBroker } from '@core/ports/messaging/MessageBroker';
import sinon from 'sinon';
import { Customer } from '@/core/domain/Customer';
import { FirestoreCustomerRepository } from '@/infrastructure/repositories/FirestoreCustomerRepository';
import { RabbitMQAdapter } from '@/infrastructure/messaging/RabbitMQAdapter';

describe('CreateCustomerUseCase', () => {
  let customerRepository: sinon.SinonStubbedInstance<CustomerRepository>;
  let messageBroker: sinon.SinonStubbedInstance<MessageBroker>;
  let createCustomerUseCase: CreateCustomerUseCase;

  beforeEach(() => {
    customerRepository = sinon.createStubInstance(FirestoreCustomerRepository);
    messageBroker = sinon.createStubInstance(RabbitMQAdapter);

    createCustomerUseCase = new CreateCustomerUseCase(
      customerRepository,
      messageBroker
    );
  });

  it('should create a new customer successfully', async () => {
    const customerData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    };
    customerRepository.findByEmail.resolves(null);

    const customer = await createCustomerUseCase.execute(customerData);

    // Assert
    expect(customer.getName()).toBe(customerData.name);
    expect(customer.getEmail()).toBe(customerData.email);
    expect(customer.getPhone()).toBe(customerData.phone);
    sinon.assert.calledOnce(customerRepository.save);
    sinon.assert.calledWith(messageBroker.publish, 'customer.created', sinon.match({
      name: customerData.name,
      email: customerData.email
    }));
  });

  it('should throw error when customer email already exists', async () => {
    // Arrange
    const customerData = {
      name: 'John Doe',
      email: 'existing@example.com'
    };
    customerRepository.findByEmail.resolves(Customer.create({ name: 'Existing user', email: customerData.email }));

    // Act & Assert
    await expect(createCustomerUseCase.execute(customerData))
      .rejects
      .toThrow('Customer with this email already exists');

    sinon.assert.notCalled(customerRepository.save);
    sinon.assert.notCalled(messageBroker.publish);
  });
});