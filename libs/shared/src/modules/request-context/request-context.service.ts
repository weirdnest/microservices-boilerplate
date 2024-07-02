import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { randomUUID } from 'crypto';
import { IRequestContext } from './interfaces/request-context-service.interface';
import * as _ from 'lodash';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService implements IRequestContext {
  private readonly contextMap: Map<string, any> = new Map();

  constructor(@Inject(REQUEST) private readonly request: Request) {
    this.set('id', randomUUID());
  }

  createFromHeaders(headers: Record<string, unknown>): void {
    if (headers) {
      this.set('headers', headers);
      const contextId = _.get(headers, 'x-context-id', '');
      if (contextId) {
        this.set('id', contextId);
      }
    }
  }

  set<T>(key: string, value: T): void {
    this.contextMap.set(key, value);
  }

  get<T>(key: string): T | undefined {
    return this.contextMap.get(key) as T;
  }

  getRequest(): Request {
    return this.request;
  }
}
