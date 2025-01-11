import { ServerConfig } from '@infrastructure/config/ServerConfig';
import { CreateCustomerUseCase } from '@core/usecases/CreateCustomerUseCase';
import { FirestoreCustomerRepository } from '@infrastructure/repositories/FirestoreCustomerRepository';
import { CustomerController } from '@/application/controllers/CustomerController';
import { JwtTokenService } from '@infrastructure/auth/auth/JwtTokenService';
import { AuthenticateCustomerUseCase } from './core/auth/AuthenticateCustomerUseCase';
import { AuthController } from '@application/controllers/AuthController';

export class Application {
  private readonly serverConfig: ServerConfig;
  private readonly port: number;

  constructor() {
    this.serverConfig = ServerConfig.getInstance();
    this.port = parseInt(process.env.PORT || '3000');

    this.setupApplication();
  }

  private setupApplication(): void {
    try {
      const httpServer = this.serverConfig.getHttpServer();

      const customerRepository = new FirestoreCustomerRepository();

      const jwtTokenService = new JwtTokenService(
        process.env.JWT_SECRET!,
        parseInt(process.env.JWT_EXPIRES_IN || '3600')
      );

      const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
      const authenticateCustomerUseCase = new AuthenticateCustomerUseCase(
        customerRepository,
        jwtTokenService
      );

      new AuthController(
        httpServer,
        authenticateCustomerUseCase
      );
      new CustomerController(
        httpServer,
        createCustomerUseCase
      );
    } catch (error) {
      console.error('Error setting up application:', error);
      process.exit(1);
    }
  }

  public async start(): Promise<void> {
    try {
      const httpServer = this.serverConfig.getHttpServer();
      await httpServer.listen(this.port);
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const application = new Application();
  application.start().catch((error) => {
    console.error('Application failed to start:', error);
    process.exit(1);
  });
}