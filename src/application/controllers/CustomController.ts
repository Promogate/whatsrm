import { CreateCustomer } from '@/core/ports/usecases/CreateCustomer';
import { HttpServer, HttpRequest, HttpResponse } from '@core/ports/http/HttpServer';

export class CustomerController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly createCustomerUseCase: CreateCustomer
  ) {
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.httpServer.on('/customers', 'post', this.createCustomer.bind(this));
  }

  private async createCustomer(request: HttpRequest): Promise<HttpResponse> {
    try {
      const customer = await this.createCustomerUseCase.execute(request.body);
      
      return {
        statusCode: 201,
        body: customer.toJSON()
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        body: { error: error.message }
      };
    }
  }
}