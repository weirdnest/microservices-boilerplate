import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { HttpStatusMessage } from '../constants';

@Catch(BadRequestException)
export class MicroserviceExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | any = HttpStatusMessage.INTERNAL_SERVER_ERROR;

    if (typeof exception.getStatus === 'function') {
      statusCode = exception.getStatus() || statusCode;
    }
    if (typeof exception.getResponse === 'function') {
      message = exception.getResponse() || message;
    }
    if (message && typeof message === 'object') {
      if (message.statusCode) {
        statusCode = message.statusCode;
      }
      if (message.message) {
        message = message.message;
      }
    }

    // console.log(`MicroserviceExceptionFilter.catch: exception:`, {
    //   statusCode,
    //   message,
    // });
    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(
        `MicroserviceExceptionFilter.catch: internal error:`,
        exception,
      );
    }
    throw new RpcException({
      statusCode,
      message,
    });
  }
}
