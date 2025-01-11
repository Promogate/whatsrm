import { CustomerRepository } from '@core/ports/repositories/CustomerRepository';
import { TokenService } from '@core/ports/auth/TokenService';
import { Token } from '@core/domain/auth/Token';
import { compare } from 'bcrypt';

interface AuthenticateCustomerDTO {
  email: string;
  password: string;
}

export class AuthenticateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(data: AuthenticateCustomerDTO): Promise<Token> {
    const customer = await this.customerRepository.findByEmail(data.email);
    
    if (!customer) {
      throw new Error('Invalid credentials');
    }
    if (!compare(data.password, customer.getPassword())) {
      throw new Error('Invalid credentials');
    }
    
    const tokenPayload = {
      userId: customer.getId(),
      email: customer.getEmail()
    };

    return this.tokenService.generateToken(tokenPayload);
  }
}