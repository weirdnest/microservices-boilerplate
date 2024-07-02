import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
} from '@nestjs/common';
import { IRequestContext } from '@libs/shared/modules/request-context/interfaces/request-context-service.interface';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { IArticlesService } from './interfaces/articles-service.interface';

@Controller('articles')
export class ArticlesRestController {
  constructor(
    @Inject(IArticlesService)
    private readonly articlesService: IArticlesService,
    @Inject(IRequestContext)
    private readonly context: IRequestContext,
  ) {}

  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.articlesService.create(dto, this.context);
  }

  @Get()
  findMany(@Query() dto: any = {}) {
    return this.articlesService.findMany(dto, this.context);
  }

  @Get(':id')
  findOne(@Query() query: any = {}) {
    return this.articlesService.findOne(query, this.context);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto, this.context);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id, this.context);
  }
}
