import { AuthenticatedRequest, HttpMiddleware, HttpResponse } from '@core/ports/http/HttpServer';

export class MockAuthMiddleware implements HttpMiddleware {
  async handle(request: AuthenticatedRequest): Promise<HttpResponse | void> {
    request.user = {
      userId: 'mock-user-id',
      email: 'mock-user-email'
    };
  }
}