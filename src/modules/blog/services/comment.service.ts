import { Inject, Injectable, Scope } from '@nestjs/common';
import { BlogEntity } from '../entities/blog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateCommentDto } from '../dto/comment.dto';
import { BlogCommentEntity } from '../entities/comment.entity';
import { BlogService } from './blog.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from 'src/common/utils/pagination.util';

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

  async create(commentDto: CreateCommentDto) {
    const { parentId, text, blogId } = commentDto;
    const { id: userId } = this.request.user; //in request we access that user who registered and login.***
    const blog = await this.blogService.checkExistBlogById(blogId);
    let parent = null;
    if (parentId && !isNaN(parentId)) {
      parent = await this.blogCommentRepository.findOneBy({ id: +parentId });
    }
    await this.blogCommentRepository.insert({
      //we use insert instead create because we dont use in the continuation.
      text,
      accepted: true,
      blogId,
      parentId: parent ? parentId : null,
      userId,
    });
    return {
      message: 'comment submitted successfully',
    };
  }
  async find(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [comments, count] = await this.blogCommentRepository.findAndCount({
      where: {},
      relations : {
        blog : true ,
        user : {profile : true}
      },
      select : {
        blog : {
          title : true
        },
        user : {
          username : true ,
          profile : {
            nick_name : true
          }
        }
      },
      skip,
      take: limit,
      order: { id: 'DESC' },
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      comments,
    };
  }
}
