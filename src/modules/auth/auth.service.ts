import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthType } from './enums/type.enum';
import { AuthMethod } from './enums/method.enum';
import { isEmail, isMobilePhone, isPhoneNumber } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../user/entities/profile.entity';
import { OtpEntity } from '../user/entities/otp.entity';
import { randomInt } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
      @InjectRepository(UserEntity) private userRepository:Repository<UserEntity>,
      @InjectRepository(ProfileEntity) private profileRepository:Repository<ProfileEntity> ,
      @InjectRepository(OtpEntity) private otpRepository:Repository<OtpEntity> ,

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
        const otp = await this.saveOtp(user.id)
        return {
          code : otp.code 
        }
      }
     async register(method : AuthMethod , username : string){
        const validUsername = this.usernameValidator(method , username)
        let user : UserEntity = await this.checkExistUser(method , validUsername)
          if(user) throw new ConflictException('this account already exist')
          if(method === AuthMethod.Username) throw new BadRequestException('invalid data for register')
        user = this.userRepository.create({
          [method] : username 
        })
        user = await this.userRepository.save(user);
        user.username = `m_${user.id}` //create unique userID for users that register their account.
        await this.userRepository.save(user);
        const otp = await this.saveOtp(user.id);
        return {
          code : otp.code 
        }
      }
      async checkOtp(){}
      async saveOtp(userId : number){
        const code = randomInt(10000 , 99999).toString();
        const expiresIn = new Date(Date.now() + (1000 * 60 * 2))
        let otp = await this.otpRepository.findOneBy({userId});
        let existOtp = false;
        if(otp){
          existOtp = true
          otp.code = code;
          otp.expiresIn = expiresIn;
        }else {
            otp = this.otpRepository.create({
                code ,
                expiresIn ,
                userId
            })
        }
        otp = await this.otpRepository.save(otp)
        if(!existOtp){
          await this.userRepository.update({id : userId} , {
          otpId : otp.id
        })
        }
        return otp;
      }
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