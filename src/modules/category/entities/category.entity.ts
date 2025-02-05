import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntitiName } from "src/common/enums/entity.enum";
import { BlogCategoryEntity } from "src/modules/blog/entities/blog-category.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity(EntitiName.Category)//EntitiName file we created in enums to nomination our entities.
export class CategoryEntity extends BaseEntity { //BaseEntity file we created and we write id and dont need every time in entities repeat id.
    @Column()
    title : string;
    @Column({nullable : true})
    priority : number;
    @OneToMany(() => BlogCategoryEntity , blog => blog.category)
    blog_categories : BlogCategoryEntity[]
}
