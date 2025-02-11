import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ImageDto } from './dto/image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { Repository } from 'typeorm';
import { MulterFile } from '../user/types/files';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({scope : Scope.REQUEST})
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity) private imageRepository : Repository<ImageEntity> ,
    @Inject(REQUEST) private req : Request
  ){}
  async create(imageDto: ImageDto , image : MulterFile) {
    const userId = this.req.user.id;
    const {alt , name} = imageDto;
    let location = image?.path?.slice(7) //because we want public name removed
    await this.imageRepository.insert({
      alt : alt || name , //if alt dosent exist use name instead.//because alt is optional.
      name ,
      location ,
      userId ,
    });
    return {
      message : 'created successfully'
    }
  }

  findAll() {
    const userId = this.req.user.id;
    return this.imageRepository.find({
      where : {userId} ,//find all images that belong to specific user;
      order : {id : 'DESC'} ,//sort base on last images uploaded.***
    });
  }

  async findOne(id: number) {
    const userId = this.req.user.id;
    const image = await this.imageRepository.findOne({
      where : {userId , id} ,//search base on userId and id because when someone had id of images cant open sombody's images.********
      order : {id : 'DESC'} ,//sort base on last images uploaded.***
    });
    if(!image) throw new NotFoundException('not found any image')
    return image;
  }

  async remove(id: number) {
    const image = await this.findOne(id);
    await this.imageRepository.remove(image);
    return {
      message : 'deleted successfully'
    }
  }
}
