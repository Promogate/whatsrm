import dotenv from 'dotenv';
dotenv.config();

import { ExpressAdapter } from '@infrastructure/http/ExpressAdapter';
import { RabbitMQAdapter } from '@infrastructure/messaging/RabbitMQAdapter';
import { MessageBroker } from '@core/ports/messaging/MessageBroker';
import { HttpServer } from '@core/ports/http/HttpServer';

export class ServerConfig {
  private static instance: ServerConfig;
  private httpServer: HttpServer;
  private messageBroker: MessageBroker;

  private constructor() {
    dotenv.config();
    this.httpServer = new ExpressAdapter();
    this.messageBroker = new RabbitMQAdapter(process.env.RABBITMQ_URL || 'amqp://localhost');
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

  public getMessageBroker(): MessageBroker {
    return this.messageBroker;
  }
}