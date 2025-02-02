import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntitiName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";

@Entity(EntitiName.BlogBookmark)
export class BlogBookmarkEntity extends BaseEntity {
    @Column() //we should lnow wich user like wich blog.
    blogId : number;
    @Column()
    userId : number;                                                               //ondelete is cascade and if user deleted bookmarks of user disappear too.
    @ManyToOne(() => UserEntity , user => user.blog_bookmarks, {onDelete : 'CASCADE'})//one user can bookmarks many blogs/bookmarks had manytoone rell with user.
    user : UserEntity;                                                        //if blog deleted bookmarks removed.
    @ManyToOne(() => BlogEntity , blog => blog.bookmarks , {onDelete : 'CASCADE'})//blogs can bookmarked many times.
    blog : BlogEntity
}