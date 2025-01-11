import express, { Express, Request, Response, NextFunction, RequestHandler } from 'express';
import { HttpServer, HttpRequest, HttpResponse, HttpMiddleware } from '@core/ports/http/HttpServer';

export class ExpressAdapter implements HttpServer {
  private app: Express;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  public on<T>(
    route: string,
    method: "get" | "post" | "put" | "patch",
    handler: (request: HttpRequest) => Promise<HttpResponse>,
    middlewares: HttpMiddleware[] = []
  ): void {
    const expressMiddlewares = middlewares.map(m => this.adaptMiddleware(m));
    const expressHandler = this.adaptRoute(handler);

    this.app[method](
      route,
      ...expressMiddlewares,
      expressHandler
    );
  }

  private adaptMiddleware(middleware: HttpMiddleware): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const httpRequest: HttpRequest & { user?: any; } = {
          body: req.body,
          params: req.params,
          query: req.query as Record<string, string>,
          headers: req.headers as Record<string, string>,
          user: (req as any).user
        };

        const result = await middleware.handle(httpRequest);

        if (result) {
          res.status(result.statusCode).json(result.body);
          return;
        }

        if (httpRequest.user) {
          (req as any).user = httpRequest.user;
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  private adaptRoute(handler: (request: HttpRequest) => Promise<HttpResponse>): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const httpRequest: HttpRequest & { user?: any; } = {
          body: req.body,
          params: req.params,
          query: req.query as Record<string, string>,
          headers: req.headers as Record<string, string>,
          user: (req as any).user
        };

        const httpResponse = await handler(httpRequest);

        res.status(httpResponse.statusCode).json(httpResponse.body);
      } catch (error) {
        next(error);
      }
    };
  }

  public async listen(port: number): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        resolve();
      });
    });
  }
}