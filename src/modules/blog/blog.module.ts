import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BlogService } from './services/blog.service';
import { BlogController } from './controllers/blog.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { BlogLikesEntity } from './entities/like.entity';
import { BlogBookmarkEntity } from './entities/bookmark.entity';
import { BlogCommentService } from './services/comment.service';
import { BlogCommentEntity } from './entities/comment.entity';
import { BlogCommentController } from './controllers/comment.controller';
import { AddUserToReqWov } from 'src/common/middleware/addUserToReqWov.middleware';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      BlogEntity ,
      CategoryEntity ,
      BlogCategoryEntity ,
      BlogLikesEntity ,
      BlogBookmarkEntity ,
      BlogCommentEntity ,
    ]),
  ],
  controllers: [BlogController , BlogCommentController],
  providers: [BlogService, CategoryService , BlogCommentService],
})
//we develope a costum middleware and we want use it in specific route.
//in this case we create AddUserToReqWov middleware and we want to use it in '('blog/by-slug/:slug')' endpoint.
//with class in below we use our middlware in ('blog/by-slug/:slug') route.
export class BlogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AddUserToReqWov).forRoutes('blog/by-slug/:slug')
  }
}
