export const IRequestContext = Symbol('IRequestContext');

export interface CreateRequestContextParams {
  dto: unknown;
}

export interface IRequestContext {
  set<T>(key: string, value: T): void;
  get<T>(key: string): T | undefined;
  getRequest(): Request;
  createFromHeaders(
    values?: Record<string, unknown>,
    params?: CreateRequestContextParams,
  ): void;
}
