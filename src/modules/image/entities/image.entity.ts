import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntitiName } from 'src/common/enums/entity.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { AfterLoad, Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';

@Entity(EntitiName.Image)
export class ImageEntity extends BaseEntity {
  @Column()
  name: string; //image name
  @Column()
  location: string; //location of image
  @Column()
  alt: string; //alt very usefull for SEO.***
  @Column()
  userId: number; //id of user that upload image.
  @CreateDateColumn()
  created_at: Date;
  @ManyToOne(() => UserEntity, user => user.images, { onDelete: 'CASCADE' }) //one user can have many images.
  user: UserEntity;//many(images) to one(user)
  @AfterLoad()//with afterload decorator we can do some changes after loading.
  map(){
    this.location = `http://localhost:3000/${this.location}` //for example here we create a link and after loading data create a link.
  }

}
