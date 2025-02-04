import { Inject, Injectable, Scope } from '@nestjs/common';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto } from './dto/blog.dto';
import { BlogStatus } from './enum/status.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({scope : Scope.REQUEST})

export class BlogService {
    constructor(
        @InjectRepository(BlogEntity) private blogRepository : Repository<BlogEntity> ,
        @Inject(REQUEST) private request : Request //LAST Request belong to express. 
    ){}


    async create(blogDto : CreateBlogDto){
        const user = this.request.user;//user in the request.user we created it by using express name space in request.d.ts file.
        let {title , slug , content , description , image , time_for_study} = blogDto;
        let slugData = slug ?? title;                                        //slugify dont soppurt persian and arabic we should use regexp.**
        slug = slugData?.replace(/[ًٌٍَُِّ\.\+\-_)(*&%$^#@!~'";:?><`ء)]+/g , '')?.replace(/[\s]+/g,'-')//regexp = where exist 1 or more than one space replace them with "-".
        const blog = this.blogRepository.create({
            slug ,
            title ,
            description , 
            content ,
            image ,
            status : BlogStatus.Draft ,
            time_for_study ,
            authorId : user.id ,
        });
        await this.blogRepository.save(blog); 
        return {
            message : 'created successfully'
        }
    }
}
