import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntitiName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(EntitiName.Follow)
export class FollowEntity extends BaseEntity {
    @Column()
    followingId : number; //the person who user follow it.
    @Column()
    followerId : number;
    @ManyToOne(() => UserEntity , user => user.followers , {onDelete : 'CASCADE'})
    following : UserEntity;
    @ManyToOne(() => UserEntity , user => user.following , {onDelete : 'CASCADE'})
    follower : UserEntity;
    @CreateDateColumn()
    created_at : Date;
}