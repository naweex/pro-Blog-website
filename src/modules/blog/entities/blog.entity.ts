import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntitiName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity(EntitiName.Blog)
export class BlogEntity extends BaseEntity {//in base entity only id exist.
    @Column()
    title : string;
    @Column()
    description : string; //brief description about user blog**
    @Column()
    content : string; //content and users story(blog)main blog**
    @Column()
    image : string;//image of blog,,every blogs that user create can have image that is optional.
    @Column()
    status : string
    @Column()
    authorId : number;
    @CreateDateColumn()
    created_at : Date; //time of creating blog
    @UpdateDateColumn()
    updated_at : Date; //time of updating blog
    
}