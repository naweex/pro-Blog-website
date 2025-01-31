import { Inject, Injectable, Scope } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { isDate } from 'class-validator';
import { Gender } from './enums/gender.enum';
import { ProfileImage } from './types/files';

@Injectable({scope : Scope.REQUEST})//we need requests to know which user send request to modify their profile.
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository : Repository<UserEntity> ,
    @InjectRepository(ProfileEntity) private profileRepository : Repository<ProfileEntity> ,
    @Inject(REQUEST) private request : Request
  ){}
  async changeProfile(files : ProfileImage , profileDto: ProfileDto) {
    if(files?.image_profile?.length > 0 ){
      let [image] = files?.image_profile;
      profileDto.image_profile = image?.path?.slice(7);//because /public is 7 character. 
    }
    if(files?.backGround_profile?.length > 0 ){
      let [image] = files?.backGround_profile;
      profileDto.backGround_profile = image?.path?.slice(7);//because /public is 7 character. 
    }
    const {id : userId , profileId} = this.request.user; //give userid in request.user
    let profile = await this.profileRepository.findOneBy({userId});
    const {bio , birthday , gender , linkedin_profile , nick_name , x_profile , image_profile , backGround_profile} = profileDto;
    if(profile){
        if(bio) profile.bio = bio;
        if(nick_name) profile.nick_name = nick_name;
        if(birthday && isDate(new Date(birthday))) profile.birthday = new Date(birthday);
        //object.value treat with value like an object(Gender has 3 value and object.value read them)
        if(gender && Object.values(Gender as any).includes(gender)) profile.gender = gender;
        if(linkedin_profile) profile.linkedin_profile = linkedin_profile;
        if(x_profile) profile.x_profile = x_profile;
        if(image_profile) profile.image_profile = image_profile;
        if(backGround_profile) profile.backGround_profile = backGround_profile;

    }else{
        profile = this.profileRepository.create({
        bio , 
        birthday ,
        gender , 
        linkedin_profile ,
        nick_name , 
        x_profile ,
        userId ,
        image_profile ,
        backGround_profile ,
      })
    }
    //in the end profile saved.
    profile = await this.profileRepository.save(profile)
    if(!profileId){
        await this.userRepository.update({id : userId} , {profileId : profile.id})
        //if user doesnt have profileid updated it.
    }
    return {
      message : 'successfully updated'
    }
  }
  profile(){
    const {id} = this.request.user
      return this.userRepository.findOne({
        where : {id} ,
        relations : ['profile']
      })
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }


  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
