import express, { Express, Request, Response } from 'express';
import { HttpServer, HttpRequest, HttpResponse } from '@core/ports/http/HttpServer';

export class ExpressAdapter implements HttpServer {
  private app: Express; //Verificar o motivo de não aceitar Express como tipagem

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.setupErrorHandler();
  }

  public on<T>(
    route: string,
    method: "get" | "post" | "put" | "patch",
    handler: (request: HttpRequest) => Promise<HttpResponse>
  ): void {
    this.app[method](route, async (req: Request, res: Response) => {
      try {
        const httpRequest: HttpRequest = {
          body: req.body,
          params: req.params,
          query: req.query as Record<string, string>,
          headers: req.headers as Record<string, string>
        };

        const httpResponse = await handler(httpRequest);

        res
          .status(httpResponse.statusCode)
          .set(httpResponse.headers || {})
          .json(httpResponse.body);
      } catch (error) {
        throw error;
      }
    });
  }

  public async listen(port: number): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        resolve();
      });
    });
  }

  private setupErrorHandler(): void {
    this.app.use((error: Error, req: Request, res: Response, next: any) => {
      console.error('Error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    });
  }
}