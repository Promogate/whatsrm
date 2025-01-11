import { AuthenticateCustomerUseCase } from '@/core/auth/AuthenticateCustomerUseCase';
import { HttpServer, HttpRequest, HttpResponse } from '@core/ports/http/HttpServer';

export class AuthController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly authenticateCustomerUseCase: AuthenticateCustomerUseCase
  ) {
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.httpServer.on('/auth/login', 'post', this.login.bind(this));
  }

  private async login(request: HttpRequest): Promise<HttpResponse> {
    try {
      const token = await this.authenticateCustomerUseCase.execute(request.body);
      
      return {
        statusCode: 200,
        body: token
      };
    } catch (error: any) {
      return {
        statusCode: 401,
        body: { error: error.message }
      };
    }
  }
}