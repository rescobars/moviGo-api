import * as amqp from 'amqplib';
import * as amqpConnectionManager from 'amqp-connection-manager';

export interface RabbitMQMessage {
  type: string;
  data: any;
  timestamp: Date;
}

export class RabbitMQService {
  private connection: amqpConnectionManager.AmqpConnectionManager;
  private channelWrapper: amqpConnectionManager.ChannelWrapper;
  private readonly queueName = 'movigo_events';
  private readonly exchangeName = 'movigo_exchange';

  constructor() {
    this.connection = amqpConnectionManager.connect([process.env.RABBITMQ_URL || 'amqp://localhost']);
    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel: amqp.Channel) => {
        return Promise.all([
          channel.assertExchange(this.exchangeName, 'topic', { durable: true }),
          channel.assertQueue(this.queueName, { durable: true }),
          channel.bindQueue(this.queueName, this.exchangeName, 'movigo.*'),
        ]);
      },
    });

    this.connection.on('connect', () => console.log('✅ Connected to RabbitMQ'));
    this.connection.on('disconnect', (params) => console.log('❌ Disconnected from RabbitMQ:', params.err.stack));
  }

  async publishMessage(routingKey: string, message: RabbitMQMessage): Promise<boolean> {
    try {
      const messageBuffer = Buffer.from(JSON.stringify({ ...message, timestamp: message.timestamp.toISOString() }));
      await this.channelWrapper.publish(this.exchangeName, routingKey, messageBuffer, { persistent: true });
      console.log(`📤 Message published to ${routingKey}:`, message.type);
      return true;
    } catch (error) {
      console.error('❌ Error publishing message:', error);
      return false;
    }
  }

  async consumeMessages(callback: (message: RabbitMQMessage) => void): Promise<void> {
    this.channelWrapper.addSetup((channel: amqp.Channel) => {
      return channel.consume(this.queueName, (msg) => {
        if (msg) {
          try {
            const message: RabbitMQMessage = JSON.parse(msg.content.toString());
            console.log(`📥 Message received:`, message.type);
            callback(message);
            channel.ack(msg);
          } catch (error) {
            console.error('❌ Error processing message:', error);
            channel.nack(msg, false, false);
          }
        }
      });
    });

    console.log('👂 RabbitMQ consumer started');
  }

  async close(): Promise<void> {
    try {
      await this.channelWrapper.close();
      await this.connection.close();
      console.log('🔌 RabbitMQ connection closed');
    } catch (error) {
      console.error('❌ Error closing RabbitMQ connection:', error);
    }
  }

  isConnected(): boolean {
    return this.connection.isConnected();
  }
}

// Singleton instance
export const rabbitMQService = new RabbitMQService();
