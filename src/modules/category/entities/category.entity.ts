import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntitiName } from "src/common/enums/entity.enum";
import { Column, Entity } from "typeorm";

@Entity(EntitiName.Category)//EntitiName file we created in enums to nomination our entities.
export class CategoryEntity extends BaseEntity { //BaseEntity file we created and we write id and dont need every time in entities repeat id.
    @Column()
    title : string
    @Column({nullable : true})
    priority : number
}
