import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntitiName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne } from "typeorm";

@Entity(EntitiName.BlogComments)
export class BlogCommentEntity extends BaseEntity {
    @Column()
    text : string;
    @Column({default : false})//by default comment not accepted.
    accepted : boolean; //comment verified or not
    @Column()
    blogId : number; //for which blog user commented.
    @Column()
    userId : number;//which user leave comment.
    @Column()
    parentId : number; //id of parent cooment.                      //delete comment of delete account user.
    @ManyToOne(() => UserEntity , user =>  user.blog_comments , {onDelete : 'CASCADE'}) //user can leave a comment in many blogs.
    @CreateDateColumn()
    created_at : Date;
}