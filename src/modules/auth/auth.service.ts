import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthType } from './enums/type.enum';
import { AuthMethod } from './enums/method.enum';
import { isEmail, isMobilePhone, isPhoneNumber } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../user/entities/profile.entity';

@Injectable()
export class AuthService {
    constructor(
      @InjectRepository(UserEntity) private userRepository:Repository<UserEntity>,
      @InjectRepository(ProfileEntity) private profileRepository:Repository<ProfileEntity>
    ){}
      UserExistence(authDto : AuthDto){
        const {method , type , username} = authDto;
        switch (type) {
          case AuthType.Login:
            return this.login(method , username);
          case AuthType.Register:
            return this.register(method , username);
          default:
            throw new UnauthorizedException('')
        }
      }
     async login(method : AuthMethod , username : string){
        const validUsername = this.usernameValidator(method , username);
        let user : UserEntity = await this.checkExistUser(method , validUsername)
          if(!user) throw new UnauthorizedException('cant found any account')
      }
     async register(method : AuthMethod , username : string){
        const validUsername = this.usernameValidator(method , username)
        let user : UserEntity = await this.checkExistUser(method , validUsername)
          if(user) throw new ConflictException('this account already exist')
      }
      async checkOtp(){}
      async checkExistUser(method : AuthMethod , username : string){
        let user : UserEntity;
        if(method === AuthMethod.Phone){
          user = await this.userRepository.findOneBy({phone : username})
        }else if(method === AuthMethod.Email){
          user = await this.userRepository.findOneBy({email : username})
        }else if(method === AuthMethod.Username){
          user = await this.userRepository.findOneBy({username})
        }else {
          throw new BadRequestException('login data not valid')
        }
        return user;
      }
      usernameValidator(method : AuthMethod , username : string){
        switch (method) {
          case AuthMethod.Email:
            if(isEmail(username)) return username
            throw new BadRequestException('email format is not corect')
          case AuthMethod.Phone:
            if(isMobilePhone(username , 'fa-IR')) return username
            throw new BadRequestException('phone number format is incorrect')
          case AuthMethod.Username:
            return username;
        
          default:
            throw new UnauthorizedException('username data is not valid')
        }
      }
    }