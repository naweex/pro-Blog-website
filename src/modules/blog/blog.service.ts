import { Inject, Injectable, Scope } from '@nestjs/common';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto } from './dto/blog.dto';
import { BlogStatus } from './enum/status.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { randomId } from 'src/common/utils/functions.utils';

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
        const isExist = await this.checkBlogBySlug(slug)
        if(isExist){
            slug+= `-${randomId()}` //if user create new blog and the slug of blog already exist__
                                    //patch a randome id to end of the new slugs blog.
        }
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
    async checkBlogBySlug(slug : string) { //if blog exist with the same name turn to false 
        const blog = await this.blogRepository.findOneBy({slug})
        return !!blog; //!! this exclamation mark turn value to boolean.
        //if blog exist it should be true if dont exist false.
    }
}
