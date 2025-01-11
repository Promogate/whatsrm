import { HttpRequest, HttpResponse } from '@core/ports/http/HttpServer';
import { TokenService } from '@core/ports/auth/TokenService';

export class AuthMiddleware {
  constructor(private readonly tokenService: TokenService) { }

  async handle(request: HttpRequest & { user?: { userId: string, email: string; }; }): Promise<HttpResponse | void> {
    try {
      const authHeader = request.headers['authorization'];

      if (!authHeader) {
        return {
          statusCode: 401,
          body: { error: 'No token provided' }
        };
      }

      const [, token] = authHeader.split(' ');

      if (!token) {
        return {
          statusCode: 401,
          body: { error: 'Token malformatted' }
        };
      }

      const decoded = this.tokenService.verifyToken(token);

      request.user = decoded;

    } catch (error) {
      return {
        statusCode: 401,
        body: { error: 'Token invalid' }
      };
    }
  }
}