import { CreateCustomer, CreateCustomerDTO } from '@core/ports/usecases/CreateCustomer';
import { CustomerRepository } from '@core/ports/repositories/CustomerRepository';
import { Customer } from '@core/domain/Customer';

export class CreateCustomerUseCase implements CreateCustomer {
  constructor(
    private readonly customerRepository: CustomerRepository
  ) { }

  async execute(data: CreateCustomerDTO): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findByEmail(data.email);
    if (existingCustomer) {
      throw new Error('Customer with this email already exists');
    }
    const customer = Customer.create({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone
    });
    await this.customerRepository.save(customer);

    return customer;
  }
}