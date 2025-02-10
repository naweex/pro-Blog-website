import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { BlogEntity } from '../entities/blog.entity';
import { IsNull, Repository } from 'typeorm';
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
    @Inject(forwardRef(() => BlogService)) private blogService: BlogService //**when we use two service in each other we get dependency injection error/
    //for solve this problem we should use forwardref.***cycle (DI)/
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
      relations: {
        blog: true,
        user: { profile: true },
      },
      select: {
        blog: {
          title: true,
        },
        user: {
          username: true,
          profile: {
            nick_name: true,
          },
        },
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
  async checkExistById(id: number) {
    const comment = await this.blogCommentRepository.findOneBy({ id });
    if (!comment) throw new NotFoundException('not found comment');
    return comment;
  }
  async accept(id: number) {
    const comment = await this.checkExistById(id);
    if (comment.accepted)
      throw new BadRequestException('this comment already accepted');
    comment.accepted = true; //if comment accepted before so we show error if not we switch it to true.
    await this.blogCommentRepository.save(comment);
    return {
      message: 'updated successfully',
    };
  }
  async reject(id: number) {
    const comment = await this.checkExistById(id);
    if (!comment.accepted)
      throw new BadRequestException('this comment already rejected');
    comment.accepted = false;
    await this.blogCommentRepository.save(comment);
    return {
      message: 'updated successfully',
    };
  }
  async findCommentsOfBlog(blogId: number, paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [comments, count] = await this.blogCommentRepository.findAndCount({
      where: {
        blogId,
        parentId: IsNull(),
      },
      relations: {
        user: { profile: true },
        children: {//**in every websites 2 first comments showed for users,you should click and see other comments.***
          user: { profile: true },
          children: {
            user: { profile: true },
          }, //here we give children(first answer) and children of children.main comment and answer will show.
        },
      },
      select: {
        user: {
          username: true,
          profile: {
            nick_name: true,
          },
        },
        children: {
          text : true ,
          created_at : true ,
          parentId : true ,
          user: {
            username: true,
            profile: {
              nick_name: true,
            },
          },
          children: {
            text : true ,
            created_at : true ,
            parentId : true , 
            user: {
              username: true,
              profile: {
                nick_name: true,
              },
            },
          },
        },
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
