import {
  FindOptionsWhere,
  FindOneOptions,
  FindManyOptions,
  ObjectId,
  DeepPartial,
} from 'typeorm';
import {
  ObjectLiteral,
  QueryDeepPartialEntity,
} from './query-deep-partial-entity';

export type ServiceFindOneOptions<Entity> =
  | FindOptionsWhere<Entity>
  | FindOneOptions<Entity>;
export type ServiceFindManyOptions<Entity> =
  | FindOptionsWhere<Entity>
  | FindManyOptions<Entity>;

export type ServiceFindResourceOptions<Entity> =
  | string
  | number
  | Date
  | ObjectId
  | string[]
  | number[]
  | Date[]
  | ObjectId[]
  | FindOptionsWhere<Entity>;

export interface IFindManyResponse<Entity> {
  total: number;
  data: Entity[];
}

export interface IRepositoryRequestParams {
  entityManager?: any;
}

export type EntitiesToUpsert<Entity> =
  | QueryDeepPartialEntity<ObjectLiteral extends Entity ? unknown : Entity>
  | QueryDeepPartialEntity<ObjectLiteral extends Entity ? unknown : Entity>[];

export interface IRepository<Entity> {
  getRepository(entity: unknown, params?: IRepositoryRequestParams): unknown;
  create(
    body: DeepPartial<Entity>,
    params?: IRepositoryRequestParams,
  ): Promise<Entity>;
  save(body: any, params?: IRepositoryRequestParams): Promise<Entity>;
  count(query?: any): Promise<number>;
  findAndCount(query?: any): Promise<[Entity[], number]>;
  findOne(query?: any): Promise<Entity>;
  findMany(query?: any): Promise<IFindManyResponse<Entity>>;
  find(query?: any): Promise<Entity[]>;
  update(
    id: string | string[],
    body?: any,
    params?: IRepositoryRequestParams,
  ): Promise<Entity[]>;
  remove(
    id: string | string[],
    params?: IRepositoryRequestParams,
  ): Promise<Entity[]>;
  upsert(
    entityOrEntities: EntitiesToUpsert<Entity>,
    query: string[],
    params?: IRepositoryRequestParams,
  ): Promise<any>;

  getFindManyOptions(
    query: ServiceFindManyOptions<Entity>,
    appendWhere?: Partial<Entity>,
  ): any;
  getFindOneOptions(
    query: ServiceFindOneOptions<Entity>,
    appendWhere?: Partial<Entity>,
  ): any;
  getFindWhereByIds(ids: string | string[], appendWhere?: Partial<Entity>): any;
}
