import * as amqp from 'amqplib';
import { randomUUID } from 'crypto';
import { EventEmitter } from 'events';

interface ChannelWithEventEmitter extends amqp.Channel {
  responseEmitter?: EventEmitter;
}

export class QueueClient {
  private uri = '';
  private queue = 'test-queue';
  private replyQueue = 'amq.rabbitmq.reply-to';
  private params: Record<string, unknown>;
  private channel: ChannelWithEventEmitter;
  private connection: amqp.Connection;
  private promises: Record<string, any> = {};

  constructor(params: any = {}) {
    this.params = params;
    if (params.uri) this.uri = params.uri;
    if (!this.uri) throw new Error(`amqp uri not in params`);
    if (params.queue) this.queue = params.queue;
    if (params.replyQueue) this.replyQueue = params.replyQueue;
    this.connectQueue(); // call the connect function
  }

  connectQueue = async () => {
    try {
      console.log(`queue.client.connectQueue: uri:`, this.uri);
      this.connection = await amqp.connect(this.uri);
      const channel: ChannelWithEventEmitter = (this.channel =
        await this.connection.createChannel());
      this.connection.on('error', (err) => {
        // recover
        console.error(`queue.client.connectQueue: connection error:`, err);
        setTimeout(() => {
          this.connectQueue();
        }, 1000);
      });

      this.channel.on('error', (err) => {
        // recover
        console.error(`queue.client.connectQueue: channel error:`, err);
        setTimeout(() => {
          this.connectQueue();
        }, 1000);
      });

      channel.responseEmitter = new EventEmitter();
      channel.responseEmitter.setMaxListeners(0);

      await this.channel.assertQueue(this.replyQueue);

      this.channel.consume(this.replyQueue, this.onConsume, { noAck: true });
      console.log(`queue.client.connectQueue: replyQueue: ${this.replyQueue}`);
    } catch (error) {
      console.log(error);
    }
  };

  onConsume = (data: amqp.Message) => {
    try {
      //data = JSON.parse(data.content.toString('utf-8'));
      const correlationId = data?.properties?.correlationId || '';
      if (!correlationId) throw new Error(`no correlationId`);
      const content = JSON.parse(data.content.toString('utf-8'));
      console.log(
        `queue.client.connectQueue: correlationId: ${correlationId}, content:`,
        content,
      );
      if (!this.channel) throw new Error(`Channel not available`);
      this.channel?.responseEmitter.emit(correlationId, content);
      /*
    const { resolve, reject } = this.promises[correlationId] || {};
    console.log(`queue.client.connectQueue: promises:`, Object.keys(this.promises));
    if (typeof resolve == 'function') {
      resolve(content);
      delete this.promises[correlationId];
    }
    */
    } catch (error) {
      console.error(`queue.client.connectQueue: error:`, error);
    }
  };

  sendMessage = async (
    data: Record<string, unknown>,
    metadata: Record<string, unknown> = {},
    queue: string = this.queue,
  ) => {
    return this.sendRPCMessage(this.channel, data, queue);
  };

  sendRPCMessage = async (
    channel: ChannelWithEventEmitter,
    message: any,
    rpcQueue: string,
    metadata = {},
  ) => {
    return new Promise((resolve, reject) => {
      const correlationId = randomUUID();
      //this.promises[correlationId] = { resolve, reject };
      //console.log(`queue.client.sendRPCMessage: correlationId: ${correlationId}, promises:`, Object.keys(this.promises));

      if (!channel) return reject(new Error(`channel not available`));

      channel.responseEmitter?.once(correlationId, (data: any) => {
        console.log(`queue.client.connectQueue: resolved data:`, data);
        resolve(data);
      });

      channel.sendToQueue(rpcQueue, Buffer.from(JSON.stringify(message)), {
        correlationId,
        replyTo: this.replyQueue,
        ...metadata,
      });
    });
  };
}
