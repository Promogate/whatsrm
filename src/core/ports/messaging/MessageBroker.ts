export interface MessageBroker {
  publish<T>(topic: string, message: T): Promise<void>;
  subscribe<T>(topic: string, handler: (message: T) => Promise<void>): Promise<void>;
}