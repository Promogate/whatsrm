export interface HttpServer {
  on<T>(
    route: string,
    method: "get" | "post" | "put" | "patch" | "delete",
    handler: (request: HttpRequest) => Promise<HttpResponse>,
    middleware?: HttpMiddleware[]
  ): void;
  listen(port: number): Promise<void>;
}

export interface HttpRequest {
  body: any;
  params: Record<string, string>;
  query: Record<string, string>;
  headers: Record<string, string>;
}

export interface HttpResponse {
  statusCode: number;
  body: any;
  headers?: Record<string, string>;
}

export interface HttpMiddleware {
  handle(request: HttpRequest): Promise<HttpResponse | void>;
}

export interface AuthenticatedRequest extends HttpRequest {
  user?: {
    userId: string;
    email: string;
  };
}