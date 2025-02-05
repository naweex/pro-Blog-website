import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { BlogEntity } from './entities/blog.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto, FilterBlogDto } from './dto/blog.dto';
import { BlogStatus } from './enum/status.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { randomId } from 'src/common/utils/functions.utils';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { isArray } from 'class-validator';
import { CategoryService } from '../category/category.service';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { EntitiName } from 'src/common/enums/entity.enum';
import { take } from 'rxjs';

@Injectable({scope : Scope.REQUEST})

export class BlogService {
    constructor(
        @InjectRepository(BlogEntity) private blogRepository : Repository<BlogEntity> ,
        @InjectRepository(BlogCategoryEntity) private blogCategoryRepository : Repository<BlogCategoryEntity> ,
        @Inject(REQUEST) private request : Request ,//LAST Request belong to express. 
        private categoryService : CategoryService
    ){}


    async create(blogDto : CreateBlogDto){
        const user = this.request.user;//user in the request.user we created it by using express name space in request.d.ts file.
        let {title , slug , content , description , image , time_for_study , categories} = blogDto;
        if(!isArray(categories) &&typeof categories === 'string'){
            categories = categories.split(',')
        }else if(!isArray(categories)){
            throw new BadRequestException('invalid category')
        }
        let slugData = slug ?? title;                                        //slugify dont soppurt persian and arabic we should use regexp.**
        slug = slugData?.replace(/[ًٌٍَُِّ\.\+\-_)(*&%$^#@!~'";:?><`ء)]+/g , '')?.replace(/[\s]+/g,'-')//regexp = where exist 1 or more than one space replace them with "-".
        const isExist = await this.checkBlogBySlug(slug)
        if(isExist){
            slug+= `-${randomId()}` //if user create new blog and the slug of blog already exist__
                                    //patch a randome id to end of the new slugs blog.
        }
        let blog = this.blogRepository.create({
            slug ,
            title ,
            description , 
            content ,
            image ,
            status : BlogStatus.Draft ,
            time_for_study ,
            authorId : user.id ,
        });
        blog = await this.blogRepository.save(blog);
        for (const categoryTitle of categories){
            let category = await this.categoryService.findOneByTitle(categoryTitle)
            if(!category) {
                category = await this.categoryService.insertByTitle(categoryTitle)
            }
            await this.blogCategoryRepository.insert({
                blogId : blog.id ,
                categoryId : category.id
            })
        }
        return {
            message : 'created successfully'
        }
    }
    async checkBlogBySlug(slug : string) { //if blog exist with the same name turn to false 
        const blog = await this.blogRepository.findOneBy({slug})
        return !!blog; //!! this exclamation mark turn value to boolean.
        //if blog exist it should be true if dont exist false.
    }
    async myBlog(){
        const {id} = this.request.user;
        return this.blogRepository.find({
            where : {
                authorId : id
            },
            order : {
                id : 'DESC' //order and give blogs to author from last blog until first blog.
            }
        })
    }
    //blog list is list of all blogs for main page of website.
    async blogList(paginationDto: PaginationDto , filterDto : FilterBlogDto){
        const {limit , page , skip} = paginationSolver(paginationDto);
        const {category , search} = filterDto;
        let where = ''
        if(category){
            where['categories'] = {//go to categories and return every blogs that category title similar to category.
                category : {  
                    title : category
                }
            }
        }
        if(search) {
            
        }
        const [blogs , count] =  await this.blogRepository.createQueryBuilder(EntitiName.Blog)
        .leftJoin('blog.categories' , 'categories')//second parameter is alias(nickname for firs parameter)
        .leftJoin('categories.category' , 'category')
        .addSelect(['categories.id' , 'category.title'])
        .where('')
        .orderBy('blog.id' , 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount()
        // const [blogs , count] =  await this.blogRepository.findAndCount({
        //     relations : { //relation on category
        //         categories : {
        //             category : true
        //         }
        //     },
        //     where,
        //     select : {
        //         categories : {
        //             id : true ,
        //             category : { 
        //                 title : true
        //             }
        //         }
        //     },
        //     order : {
        //         id : 'DESC' //order and give blogs to author from last blog until first blog.
        //     },
        //     skip ,
        //     take : limit
        // });
        return {
            pagination : paginationGenerator(count , page , limit) ,
            blogs
        }
    }
}
