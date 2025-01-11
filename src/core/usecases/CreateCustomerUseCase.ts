import { CreateCustomer, CreateCustomerDTO } from '@core/ports/usecases/CreateCustomer';
import { CustomerRepository } from '@core/ports/repositories/CustomerRepository';
import { MessageBroker } from '@core/ports/messaging/MessageBroker';
import { Customer } from '@core/domain/Customer';

export class CreateCustomerUseCase implements CreateCustomer {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly messageBroker: MessageBroker
  ) { }

  async execute(data: CreateCustomerDTO): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findByEmail(data.email);
    if (existingCustomer) {
      throw new Error('Customer with this email already exists');
    }
    const customer = Customer.create({
      name: data.name,
      email: data.email,
      phone: data.phone
    });
    await this.customerRepository.save(customer);
    await this.messageBroker.publish('customer.created', customer.toJSON());

    return customer;
  }
}