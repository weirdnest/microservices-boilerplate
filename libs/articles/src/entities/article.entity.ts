import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from './article';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ArticleEntity extends Article {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: `Article id` })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: `Article title`, maxLength: 255 })
  title: string;
}
