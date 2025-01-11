import dotenv from 'dotenv';
dotenv.config();

import { ExpressAdapter } from '@infrastructure/http/ExpressAdapter';
import { HttpServer } from '@core/ports/http/HttpServer';

export class ServerConfig {
  private static instance: ServerConfig;
  private httpServer: HttpServer;

  private constructor() {
    dotenv.config();
    this.httpServer = new ExpressAdapter();
  }

  public static getInstance(): ServerConfig {
    if (!ServerConfig.instance) {
      ServerConfig.instance = new ServerConfig();
    }
    return ServerConfig.instance;
  }

  public getHttpServer(): HttpServer {
    return this.httpServer;
  }
}