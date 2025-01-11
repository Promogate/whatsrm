import { CreateCustomerProps } from '@/core/domain/Customer';
import { CreateCustomer } from '@/core/ports/usecases/CreateCustomer';
import { HttpServer, HttpRequest, HttpResponse } from '@core/ports/http/HttpServer';
import { MessageBroker } from '@core/ports/messaging/MessageBroker';

export class CustomerController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly messageBroker: MessageBroker,
    private readonly createCustomerUseCase: CreateCustomer
  ) {
    this.setupRoutes();
    this.setupSubscriptions();
  }

  private setupRoutes(): void {
    this.httpServer.on('/customers', 'post', this.createCustomer.bind(this));
  }

  private setupSubscriptions(): void {
    this.messageBroker.subscribe('customer.created', this.handleCustomerCreated.bind(this));
  }

  private async createCustomer(request: HttpRequest): Promise<HttpResponse> {
    const customer = await this.createCustomerUseCase.execute(request.body);
    
    await this.messageBroker.publish('customer.created', customer);
    
    return {
      statusCode: 201,
      body: customer
    };
  }

  private async handleCustomerCreated(customer: CreateCustomerProps): Promise<void> {
    console.log('Customer created:', customer);
    // Lógica para processar o evento de cliente criado
  }
}