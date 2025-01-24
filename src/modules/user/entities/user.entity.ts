import { Col } from "reactstrap";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntitiName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
//we create a func in common/enums and define user and use it here in @entity.
//BaseEntity is a custome function we created.
@Entity(EntitiName.User)
export class UserEntity extends BaseEntity{//we dont use id because in baseEntity that we extend on we define id.
    @Column({unique : true})//username in not nullable because when user create an account by default create a unique username.
    username : string;
    @Column({unique : true , nullable : true})
    phone : string;
    @Column({unique : true , nullable : true})
    email : string;
    @Column({nullable : true})
    password : string
    @CreateDateColumn()
    created_at : Date
    @UpdateDateColumn()
    updated_at : Date
}
