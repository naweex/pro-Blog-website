import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntitiName } from "src/common/enums/entity.enum";
import { Column, Entity } from "typeorm";

@Entity(EntitiName.BlogLikes)
export class BlogLikesEntity extends BaseEntity {
    @Column() //we should lnow wich user like wich blog.
    blogId : number;
    @Column()
    userId : number;
}