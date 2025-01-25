import { Col } from "reactstrap";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntitiName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn } from "typeorm";
import { OtpEntity } from "./otp.entity";
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
    password : string
    @Column({nullable : true})
    otpId : number
    @OneToOne(() => OtpEntity , otp => otp.user , {nullable : true})
    @JoinColumn()
    otp : OtpEntity
    @CreateDateColumn()
    created_at : Date
    @UpdateDateColumn()
    updated_at : Date
}
