import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntitiName } from "src/common/enums/entity.enum";
import { Column, Entity, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";

@Entity(EntitiName.BlogCategory)
export class BlogCategoryEntity extends BaseEntity {
    @Column()
    blogId : number;       
    @Column()
    categoryId : number;
    @ManyToOne(() => BlogEntity , blog => blog.categories , {onDelete : 'CASCADE'})//one blog can have several categories.**category in this project work like hashtags!**
    blog : BlogEntity;
    @ManyToOne(() => CategoryEntity , category => category.blog_categories , {onDelete : 'CASCADE'})//it means one category can used for many blogs.
    category : CategoryEntity;
}