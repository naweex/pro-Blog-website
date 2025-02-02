import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntitiName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";

@Entity(EntitiName.BlogLikes)
export class BlogLikesEntity extends BaseEntity {
    @Column() //we should lnow wich user like wich blog.
    blogId : number;
    @Column()
    userId : number;                                                               //ondelete is cascade and if user deleted likes of use disappear too.
    @ManyToOne(() => UserEntity , user => user.blog_likes , {onDelete : 'CASCADE'})//one user can likes many blogs/loke had manytoone rell with user.
    user : UserEntity;                                                        //if blog deleted likes removed.
    @ManyToOne(() => BlogEntity , blog => blog.likes , {onDelete : 'CASCADE'})//blogs can liked many times.
    blog : BlogEntity
}