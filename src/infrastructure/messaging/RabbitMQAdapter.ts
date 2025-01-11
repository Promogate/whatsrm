import amqp, { Connection, Channel } from 'amqplib';
import { MessageBroker } from '@core/ports/messaging/MessageBroker';

export class RabbitMQAdapter implements MessageBroker {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  constructor(private readonly url: string) {}

  private async connect(): Promise<void> {
    if (!this.connection) {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
    }
  }

  public async publish<T>(topic: string, message: T): Promise<void> {
    await this.connect();
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }
    await this.channel.assertExchange(topic, 'fanout', { durable: true });
    this.channel.publish(
      topic,
      '',
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
  }

  public async subscribe<T>(
    topic: string, 
    handler: (message: T) => Promise<void>
  ): Promise<void> {
    await this.connect();

    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    await this.channel.assertExchange(topic, 'fanout', { durable: true });

    const { queue } = await this.channel.assertQueue('', { 
      exclusive: true,
      durable: true 
    });

    await this.channel.bindQueue(queue, topic, '');

    this.channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString()) as T;
          await handler(content);
          this.channel?.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          this.channel?.nack(msg, false, true);
        }
      }
    });
  }

  public async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}