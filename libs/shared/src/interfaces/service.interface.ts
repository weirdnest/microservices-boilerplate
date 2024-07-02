import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectId,
} from 'typeorm';
import {
  IFindManyResponse,
  ServiceFindManyOptions,
  ServiceFindOneOptions,
} from './repository.interface';
import { IRequestContext } from '../modules/request-context/interfaces/request-context-service.interface';

export interface ServiceInterface<Entity, CreateEntityDto, UpdateEntityDto> {
  create(body: CreateEntityDto, context?: IRequestContext): Promise<Entity>;
  findMany(
    query: ServiceFindManyOptions<Entity>,
    context?: IRequestContext,
  ): Promise<IFindManyResponse<Entity>>;
  findOne(
    query: ServiceFindOneOptions<Entity>,
    context?: IRequestContext,
  ): Promise<Entity>;
  update(
    id: string | string[],
    payload: UpdateEntityDto,
    context?: IRequestContext,
  ): Promise<Entity | Entity[]>;
  remove(
    id: string | string[],
    context?: IRequestContext,
  ): Promise<Omit<Entity, 'id'> | Omit<Entity, 'id'>[]>;
}

export interface ServiceRequestContext {
  entityManager?: EntityManager;
}
