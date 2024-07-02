import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Socket } from 'node:net';
import { ArticlesPatterns } from './constants';
import { Inject } from '@nestjs/common';
import { IArticlesService } from './interfaces/articles-service.interface';
import { ModuleRef } from '@nestjs/core';
import { IRequestContext } from '@libs/shared/modules/request-context/interfaces/request-context-service.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transport: ['websocket'],
})
export class ArticlesGateway {
  constructor(
    @Inject(IArticlesService)
    private readonly articlesService: IArticlesService,
    private readonly moduleRef: ModuleRef,
  ) {}

  @SubscribeMessage(ArticlesPatterns.CREATE)
  create(@MessageBody() dto: CreateArticleDto) {
    return this.articlesService.create(dto);
  }

  @SubscribeMessage(ArticlesPatterns.FIND_MANY)
  async findMany(query: any, @ConnectedSocket() client: Socket) {
    const context = await this.moduleRef.resolve(IRequestContext);
    const contextId = context?.get('id') || '';
    console.log(`ArticlesGateway.findMany:`, { contextId });
    const result = await this.articlesService.findMany(query, context);
    console.log(
      `ArticlesGateway.findMany: contextId: ${context.get('id')} result:`,
      result,
    );
    return result;
  }

  @SubscribeMessage(ArticlesPatterns.FIND_ONE)
  findOne(@MessageBody() query: any) {
    return this.articlesService.findOne(query);
  }

  @SubscribeMessage(ArticlesPatterns.UPDATE)
  update(@MessageBody() dto: UpdateArticleDto) {
    return this.articlesService.update(dto.id, dto);
  }

  @SubscribeMessage(ArticlesPatterns.REMOVE)
  remove(@MessageBody() id: string) {
    return this.articlesService.remove(id);
  }
}
