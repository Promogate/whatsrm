import { HttpServer, HttpResponse, HttpMiddleware, AuthenticatedRequest } from '@core/ports/http/HttpServer';

export class MockHttpServer implements HttpServer {
  public routes: Array<{
    route: string;
    method: string;
    handler: (request: AuthenticatedRequest) => Promise<HttpResponse>;
    middleware?: HttpMiddleware[];
  }> = [];

  on(
    route: string,
    method: "get" | "post" | "put" | "patch" | "delete",
    handler: (request: AuthenticatedRequest) => Promise<HttpResponse>,
    middleware?: HttpMiddleware[]
  ): void {
    this.routes.push({ route, method, handler, middleware });
  }

  async listen(port: number): Promise<void> {
    // Mock implementation
    return Promise.resolve();
  }
}