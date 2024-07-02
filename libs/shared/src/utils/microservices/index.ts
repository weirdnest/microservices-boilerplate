import { Observable } from 'rxjs';
import { QueueClient } from './queue.client';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpStatusMessage } from '@libs/shared/exceptions';
export class MicroserviceRequestParams {
  contextId: string;
}

export const serviceRequest = async (
  service: ClientProxy,
  command: string,
  payload: any,
  params?: MicroserviceRequestParams,
) => {
  const { contextId = '' } = params || {};

  const record = new RmqRecordBuilder(payload)
    .setOptions({
      headers: {
        ['x-version']: '1.0.0',
        ['x-context-id']: contextId,
      },
      priority: 3,
    })
    .build();

  const response: Observable<unknown> = service.send(command, record);

  const resultPromise = new Promise((resolve, reject) => {
    response.subscribe({
      next: (result: Record<string, unknown>) => {
        console.log(`utils.microservices.serviceRequest: result:`, result);
        if (result?.error) {
          reject(result);
        } else {
          resolve(result);
        }
      },
      error(exception) {
        // console.log(`utils.microservices.serviceRequest: error:`, exception);
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | any = HttpStatusMessage.INTERNAL_SERVER_ERROR;

        let { error, response } = exception || {};
        if (!response && error) {
          response = error;
        }
        if (response?.statusCode) {
          statusCode = response.statusCode;
        }
        if (response?.message) {
          message = response.message;
        }
        console.log(`utils.microservices.serviceRequest: error:`, {
          statusCode,
          message,
        });

        reject(new HttpException(message, statusCode));
      },
    });
  });
  return resultPromise;
};

export { QueueClient };
let client: QueueClient;
export const getRabbitClient = () => {
  if (!client) {
    const user = process.env.RABBITMQ_USER;
    const password = process.env.RABBITMQ_PASS;
    const host = process.env.RABBITMQ_HOST;
    const proto = process.env.RABBITMQ_PROTO || 'amqp';

    const responseQueue = `response_${
      process.env.APP_ID || Math.round(Math.random() * 99999)
    }`;
    const clientParams = {
      uri: `${proto}://${user}:${password}@${host}`,
      replyQueue: responseQueue,
    };
    console.log(`microservices.getRabbitClient: clientParams:`, clientParams);
    client = new QueueClient(clientParams);
  }
  return client;
};
