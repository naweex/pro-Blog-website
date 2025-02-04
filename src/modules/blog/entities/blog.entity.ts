import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntitiName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { BlogStatus } from "../enum/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { BlogLikesEntity } from "./like.entity";
import { BlogBookmarkEntity } from "./bookmark.entity";
import { BlogCommentEntity } from "./comment.entity";

@Entity(EntitiName.Blog)
export class BlogEntity extends BaseEntity {//in base entity only id exist.
    @Column()
    title : string;
    @Column()
    description : string; //brief description about user blog**
    @Column()
    content : string; //content and users story(blog)main blog**
    @Column({nullable : true})//nullable : true it meant the parameter optional and it could be null.
    image : string;//image of blog,,every blogs that user create can have image that is optional.
    @Column({unique : true})
    slug : string;//when user open a blog in the endpoint(in url) show the brief title of blog/slug is important for seo and give us preety url.
    @Column()
    time_for_study : string;//every blog had time study that define how much time need to read blog.
    @Column({default : BlogStatus.Draft}) //by default in first step when user create blog it is draft.
    status : string
    @Column()
    authorId : number;//author and blog had many to one relationship/one author can have many blogs.
    @ManyToOne(() => UserEntity , user => user.blog , {onDelete : 'CASCADE'})//ondelete : cascade mean if author deleted every blogs with that author deleted.
    author : UserEntity;
    @OneToMany(() => BlogLikesEntity , like => like.blog)
    likes : BlogLikesEntity[] 
    @OneToMany(() => BlogBookmarkEntity , bookmark => bookmark.blog)
    bookmarks : BlogBookmarkEntity[] //a blog can bookmarked by several users.
    @OneToMany(() => BlogCommentEntity , comment => comment.blog)
    comments : BlogCommentEntity[]
    @CreateDateColumn()
    created_at : Date; //time of creating blog
    @UpdateDateColumn()
    updated_at : Date; //time of updating blog
    
}