import { Customer } from '@core/domain/Customer';

export interface CreateCustomerDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface CreateCustomer {
  execute(data: CreateCustomerDTO): Promise<Customer>;
}