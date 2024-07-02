import * as _ from 'lodash';
import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ModuleRef } from '@nestjs/core';
import { IRequestContext } from '@libs/shared/modules/request-context/interfaces/request-context-service.interface';
import { TransactionInterceptor } from '@libs/shared/interceptors/transaction.interceptor';
import { IArticlesService } from './interfaces/articles-service.interface';
import { ArticlesPatterns } from './constants';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller()
export class ArticlesRmqController {
  constructor(
    @Inject(IArticlesService)
    private readonly articlesService: IArticlesService,
    private readonly moduleRef: ModuleRef,
  ) {}

  @MessagePattern(ArticlesPatterns.CREATE)
  @UseInterceptors(TransactionInterceptor)
  async create(
    @Payload() createArticleDto: CreateArticleDto,
    @Ctx() context: RmqContext,
  ) {
    const {
      properties: { headers },
    } = context.getMessage();
    const requestContext = await this.moduleRef.resolve(IRequestContext);

    return await this.articlesService.create(createArticleDto);
  }

  @MessagePattern(ArticlesPatterns.FIND_MANY)
  async findMany(@Payload() dto: any, @Ctx() context: RmqContext) {
    const requestContext = await this.moduleRef.resolve(IRequestContext);
    const {
      properties: { headers },
    } = context.getMessage();
    requestContext.createFromHeaders(headers, { dto });
    return await this.articlesService.findMany(dto, requestContext);
  }

  @MessagePattern(ArticlesPatterns.FIND_ONE)
  async findOne(@Payload() dto: any, @Ctx() context: RmqContext) {
    const requestContext = await this.moduleRef.resolve(IRequestContext);
    const {
      properties: { headers },
    } = context.getMessage();
    requestContext.createFromHeaders(headers, { dto });
    return await this.articlesService.findOne(dto, requestContext);
  }

  @MessagePattern(ArticlesPatterns.UPDATE)
  async update(@Payload() dto: UpdateArticleDto, @Ctx() context: RmqContext) {
    const requestContext = await this.moduleRef.resolve(IRequestContext);
    const {
      properties: { headers },
    } = context.getMessage();
    requestContext.createFromHeaders(headers, { dto });
    return await this.articlesService.update(dto.id, dto);
  }

  @MessagePattern(ArticlesPatterns.REMOVE)
  async remove(@Payload() id: string, @Ctx() context: RmqContext) {
    const requestContext = await this.moduleRef.resolve(IRequestContext);
    const {
      properties: { headers },
    } = context.getMessage();
    requestContext.createFromHeaders(headers, { id });
    return await this.articlesService.remove(id);
  }
}
