import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, concatMap, finalize } from 'rxjs';
import { DataSource } from 'typeorm/data-source/DataSource';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log(`TransactionInterceptor.intercept`);
    return next.handle().pipe(
      // concatMap gets called when route handler completes successfully
      concatMap(async (data) => {
        await queryRunner.commitTransaction();
        return data;
      }),
      // catchError gets called when route handler throws an exception
      catchError(async (e) => {
        console.log(`TransactionInterceptor.intercept: rolling back`);
        await queryRunner.rollbackTransaction();
        throw e;
      }),
      // always executed, even if catchError method throws an exception
      finalize(async () => {
        await queryRunner.release();
      }),
    );
  }
}
