import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntitiName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BlogEntity } from "./blog.entity";

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
    @Column({nullable : true})//nullable means it can be empty.
    parentId : number; //id of parent cooment.                      //delete comment of delete account user.
    @ManyToOne(() => UserEntity , user =>  user.blog_comments , {onDelete : 'CASCADE'}) //user can leave a comment in many blogs.
    user : UserEntity;                                      //when blog deleted comments are deleted too.
    @ManyToOne(() => BlogEntity , blog =>  blog.comments , {onDelete : 'CASCADE'}) //blogs can have many comments.
    blog : BlogEntity;                                  //parent is a comment that have several comments on the below. 
    @ManyToOne(() => BlogCommentEntity , parent =>  parent.children, {onDelete : 'CASCADE'}) //user can leave a comment in many blogs.
    parent : BlogCommentEntity;
    @OneToMany(() => BlogCommentEntity , comment => comment.parent)//parent can have several children but a children can have one parent.
    @JoinColumn({name : 'parent'})
    children : BlogCommentEntity[]
    @CreateDateColumn()
    created_at : Date;
}