export interface HttpServer {
  on<T>(
    route: string,
    method: "get" | "post" | "put" | "patch",
    handler: (request: HttpRequest) => Promise<HttpResponse>): void;
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