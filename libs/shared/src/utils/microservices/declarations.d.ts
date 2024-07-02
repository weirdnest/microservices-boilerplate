
export interface ServicePayload<T> {
  payload:T;
  user:any;
}

export interface FindAllResponse<T> {
  data: T[],
  total: number,
}