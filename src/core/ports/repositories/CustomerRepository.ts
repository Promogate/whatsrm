import { Customer } from '@core/domain/Customer';

export interface CustomerRepository {
  save(customer: Customer): Promise<void>;
  findByEmail(email: string): Promise<Customer | null>;
  findById(customerId: string): Promise<Customer | null>;
}