import { Col } from "reactstrap";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntitiName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, Like, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { OtpEntity } from "./otp.entity";
import { ProfileEntity } from "./profile.entity";
import { BlogEntity } from "src/modules/blog/entities/blog.entity";
import { BlogLikesEntity } from "src/modules/blog/entities/like.entity";
import { BlogBookmarkEntity } from "src/modules/blog/entities/bookmark.entity";
import { BlogCommentEntity } from "src/modules/blog/entities/comment.entity";
import { ImageEntity } from "src/modules/image/entities/image.entity";
//we create a func in common/enums and define user and use it here in @entity.
//BaseEntity is a custome function we created.
@Entity(EntitiName.User)
export class UserEntity extends BaseEntity{//we dont use id because in baseEntity that we extend on we define id.
    @Column({unique : true , nullable : true})
    username : string;
    @Column({unique : true , nullable : true})
    phone : string;
    @Column({unique : true , nullable : true})
    email : string;
    @Column({nullable : true})
    new_email : string;
    @Column({nullable : true})
    new_phone : string;
    @Column({nullable : true , default : false})
    verify_email : boolean;
    @Column({nullable : true , default : false})
    verify_phone : boolean;
    @Column({nullable : true})
    password : string
    @Column({nullable : true})
    otpId : number
    @Column({nullable : true})
    profileId : number
    @OneToOne(() => OtpEntity , otp => otp.user , {nullable : true})
    @JoinColumn()
    otp : OtpEntity
    @OneToOne(() => ProfileEntity , profile => profile.user , {nullable : true})
    @JoinColumn()
    profile : ProfileEntity
    @OneToMany(() => BlogEntity , blog => blog.author)
    blog : BlogEntity[] //in users account we can take arrays of users blogs.
    @OneToMany(() => BlogLikesEntity , like => like.user)
    blog_likes : BlogLikesEntity[] 
    @OneToMany(() => BlogBookmarkEntity , bookmark => bookmark.user)
    blog_bookmarks : BlogBookmarkEntity[] 
    @OneToMany(() => BlogCommentEntity , comment => comment.user)
    blog_comments : BlogCommentEntity[] 
    @OneToMany(() => ImageEntity , image => image.user)//one user can have many images,,one(user) to many(images)
    images : ImageEntity[] 
    @CreateDateColumn()
    created_at : Date
    @UpdateDateColumn()
    updated_at : Date
}
