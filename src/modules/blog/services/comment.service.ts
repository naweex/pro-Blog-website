import {
    Inject,
    Injectable,
    Scope,
  } from '@nestjs/common';
  import { BlogEntity } from '../entities/blog.entity';
  import { Repository } from 'typeorm';
  import { InjectRepository } from '@nestjs/typeorm';
  import { REQUEST } from '@nestjs/core';
  import { Request } from 'express';
  import { CategoryService } from '../../category/category.service';
  import { BlogCategoryEntity } from '../entities/blog-category.entity';
  import { BlogLikesEntity } from '../entities/like.entity';
  import { BlogBookmarkEntity } from '../entities/bookmark.entity';
  import { CreateCommentDto } from '../dto/comment.dto';
import { BlogCommentEntity } from '../entities/comment.entity';
import { BlogService } from './blog.service';
  
  @Injectable({ scope: Scope.REQUEST })
  export class BlogCommentService {
    constructor(
      @InjectRepository(BlogEntity)
      private blogRepository: Repository<BlogEntity>,
      @InjectRepository(BlogCommentEntity)
      private blogCommentRepository: Repository<BlogCommentEntity>,
      @Inject(REQUEST) private request: Request, //LAST Request belong to express.
      private blogService: BlogService
    ) {}
  
    async createComment(commentDto: CreateCommentDto) {
      const {parentId , text} = commentDto;
    }
  }
  