import { Injectable } from '@nestjs/common';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto } from './dto/blog.dto';

@Injectable()

export class BlogService {
    constructor(
        @InjectRepository(BlogEntity) private blogRepository : Repository<BlogEntity> ,
    ){}


    create(blogDto : CreateBlogDto){
        let {title , slug , content , description , image , time_for_study} = blogDto;
        let slugData = slug ?? title;                                        //slugify dont soppurt persian and arabic we should use regexp.**
        slug = slugData?.replace(/[ًٌٍَُِّ\.\+\-_)(*&%$^#@!~'";:?><`ء)]+/g , '')?.replace(/[\s]+/g,'-')//regexp = where exist 1 or more than one space replace them with "-".
        return blogDto;
    }
}
