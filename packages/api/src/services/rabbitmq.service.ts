import * as amqp from 'amqplib';
import * as amqpConnectionManager from 'amqp-connection-manager';

export interface RabbitMQMessage {
  type: string;
  data: any;
  timestamp: Date;
}

// Opciones de configuración
interface RabbitMQServiceOptions {
  prefetch?: number; // mensajes por consumidor
  queueName?: string;
  exchangeName?: string;
  routingPatterns?: string[]; // patrones para bindQueue
}

export const ENUMS_QUEUE_NAME = {
  TRANSMISSION_RECEIVED: 'movigo.transmission.received',
}

export class RabbitMQService {
  private connection: amqpConnectionManager.AmqpConnectionManager;
  private channelWrapper: amqpConnectionManager.ChannelWrapper;
  private readonly queueName: string;
  private readonly exchangeName: string;
  private readonly routingPatterns: string[];
  private readonly prefetch: number;

  constructor(options?: RabbitMQServiceOptions) {
    this.queueName = options?.queueName || 'movigo_events';
    this.exchangeName = options?.exchangeName || 'movigo_exchange';
    this.routingPatterns = options?.routingPatterns || ['movigo.#'];
    this.prefetch = options?.prefetch || 50;

    // Conexión con reconexión automática
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    console.log('🔌 Connecting to RabbitMQ:', rabbitmqUrl);
    
    this.connection = amqpConnectionManager.connect([rabbitmqUrl], {
      reconnectTimeInSeconds: 5,
      heartbeatIntervalInSeconds: 5,
    });
    
    this.channelWrapper = this.connection.createChannel({
      setup: async (channel: amqp.Channel) => {
        try {
          console.log('🔧 Setting up RabbitMQ channel...');
          
          // Crear exchange
          await channel.assertExchange(this.exchangeName, 'topic', { durable: true });
          console.log(`✅ Exchange '${this.exchangeName}' created/verified`);

          // Crear cola
          await channel.assertQueue(this.queueName, { durable: true });
          console.log(`✅ Queue '${this.queueName}' created/verified`);

          // Prefetch para controlar la carga
          channel.prefetch(this.prefetch);

          // Bindings a todos los patrones
          for (const pattern of this.routingPatterns) {
            await channel.bindQueue(this.queueName, this.exchangeName, pattern);
            console.log(`✅ Queue bound to pattern '${pattern}'`);
          }

          console.log('🎉 RabbitMQ setup completed successfully');
        } catch (error) {
          console.error('❌ Error setting up RabbitMQ:', error);
          throw error;
        }
      },
    });

    this.connection.on('connect', () => {
      console.log('✅ Connected to RabbitMQ');
    });
    
    this.connection.on('disconnect', (params: any) => {
      console.log('❌ Disconnected from RabbitMQ:', params.err?.message || 'Unknown error');
    });

    this.connection.on('connectFailed', (params: any) => {
      console.log('❌ RabbitMQ connection failed:', params.err?.message || 'Unknown error');
    });
  }

  /**
   * Publicar mensaje
   */
  async publishMessage(routingKey: string, message: RabbitMQMessage): Promise<boolean> {
    try {
      const messageBuffer = Buffer.from(
        JSON.stringify({ ...message, timestamp: message.timestamp.toISOString() })
      );
      await this.channelWrapper.publish(this.exchangeName, routingKey, messageBuffer, {
        persistent: true,
      });
      return true;
    } catch (error) {
      console.error('❌ Error publishing message:', error);
      return false;
    }
  }

  /**
   * Consumir mensajes
   * @param callback función que procesa cada mensaje
   */
  async consumeMessages(callback: (message: RabbitMQMessage) => Promise<void> | void): Promise<void> {
    this.channelWrapper.addSetup((channel: amqp.Channel) => {
      return channel.consume(this.queueName, async (msg) => {
        if (!msg) return;

        try {

          const message: RabbitMQMessage = JSON.parse(msg.content.toString());
          console.log('📥 Parsed message:', message);
          // Procesamiento asíncrono seguro con ack después de terminar
          await callback(message);
          channel.ack(msg);
        } catch (error) {
          console.error('❌ Error processing message:', error);
          channel.nack(msg, false, false); // descarta mensaje para no volver a encolar
        }
      });
    });

    console.log(' RabbitMQ consumer started');
  }

  /**
   * Cerrar conexión
   */
  async close(): Promise<void> {
    try {
      await this.channelWrapper.close();
      await this.connection.close();
      console.log('🔌 RabbitMQ connection closed');
    } catch (error) {
      console.error('❌ Error closing RabbitMQ connection:', error);
    }
  }

  /**
   * Verifica si la conexión está activa
   */
  isConnected(): boolean {
    return this.connection.isConnected();
  }
}

// Singleton instance
export const rabbitMQService = new RabbitMQService({
  prefetch: 50,
  routingPatterns: ['movigo.#'],
}); 