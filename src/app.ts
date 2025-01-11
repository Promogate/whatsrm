import { ServerConfig } from '@infrastructure/config/ServerConfig';
import { CreateCustomerUseCase } from '@core/usecases/CreateCustomerUseCase';
import { FirestoreCustomerRepository } from '@infrastructure/repositories/FirestoreCustomerRepository';
import { CustomerController } from '@application/controllers/CustomController';

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
      const messageBroker = this.serverConfig.getMessageBroker();

      const customerRepository = new FirestoreCustomerRepository();

      const createCustomerUseCase = new CreateCustomerUseCase(
        customerRepository,
        messageBroker
      );

      new CustomerController(
        httpServer, 
        messageBroker,
        createCustomerUseCase
      );

      this.setupErrorHandling(httpServer);

    } catch (error) {
      console.error('Error setting up application:', error);
      process.exit(1);
    }
  }

  private setupErrorHandling(httpServer: any): void {
    process.on('unhandledRejection', (reason: Error) => {
      console.error('Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (error: Error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });
  }

  public async start(): Promise<void> {
    try {
      const httpServer = this.serverConfig.getHttpServer();
      await httpServer.listen(this.port);
      
      console.log(`Server running on port ${this.port}`);

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