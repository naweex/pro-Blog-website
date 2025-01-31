import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntitiName } from "src/common/enums/entity.enum";
import { Column, Entity, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(EntitiName.Otp)
export class OtpEntity extends BaseEntity {
    @Column()
    code : string
    @Column()
    expiresIn : Date
    @Column()
    userId : number
    @Column({nullable : true})
    method : string; //method : username , phone , email
    @OneToOne(() => UserEntity , user => user.otp , {onDelete : 'CASCADE'}) //every user had one otp => one to one relation.
    user : UserEntity
}