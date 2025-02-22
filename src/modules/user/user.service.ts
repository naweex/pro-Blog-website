import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
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
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/tokens.service';
import { OtpEntity } from './entities/otp.entity';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { AuthMethod } from '../auth/enums/method.enum';
import { FollowEntity } from './entities/follow.entity';
import { PublicMessage } from 'src/common/enums/message.enum';
import { EntitiName } from 'src/common/enums/entity.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { UserBlockDto } from '../auth/dto/auth.dto';
import { UserStatus } from './enums/status.enum';

@Injectable({ scope: Scope.REQUEST }) //we need requests to know which user send request to modify their profile.
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    @InjectRepository(FollowEntity) private followRepository: Repository<FollowEntity>,
    @Inject(REQUEST) private request: Request,
    private authService: AuthService,
    private tokenService: TokenService
  ) {}
  async changeProfile(files: ProfileImage, profileDto: ProfileDto) {
    if (files?.image_profile?.length > 0) {
      let [image] = files?.image_profile;
      profileDto.image_profile = image?.path?.slice(7); //because /public is 7 character.
    }
    if (files?.backGround_profile?.length > 0) {
      let [image] = files?.backGround_profile;
      profileDto.backGround_profile = image?.path?.slice(7); //because /public is 7 character.
    }
    const { id: userId, profileId } = this.request.user; //give userid in request.user
    let profile = await this.profileRepository.findOneBy({ userId });
    const {
      bio,
      birthday,
      gender,
      linkedin_profile,
      nick_name,
      x_profile,
      image_profile,
      backGround_profile,
    } = profileDto;
    if (profile) {
      if (bio) profile.bio = bio;
      if (nick_name) profile.nick_name = nick_name;
      if (birthday && isDate(new Date(birthday)))
        profile.birthday = new Date(birthday);
      //object.value treat with value like an object(Gender has 3 value and object.value read them)
      if (gender && Object.values(Gender as any).includes(gender))
        profile.gender = gender;
      if (linkedin_profile) profile.linkedin_profile = linkedin_profile;
      if (x_profile) profile.x_profile = x_profile;
      if (image_profile) profile.image_profile = image_profile;
      if (backGround_profile) profile.backGround_profile = backGround_profile;
    } else {
      profile = this.profileRepository.create({
        bio,
        birthday,
        gender,
        linkedin_profile,
        nick_name,
        x_profile,
        userId,
        image_profile,
        backGround_profile,
      });
    }
    //in the end profile saved.
    profile = await this.profileRepository.save(profile);
    if (!profileId) {
      await this.userRepository.update(
        { id: userId },
        { profileId: profile.id }
      );
      //if user doesnt have profileid updated it.
    }
    return {
      message: 'successfully updated',
    };
  }
  async find(paginationDto: PaginationDto) {
    const {limit, page, skip} = paginationSolver(paginationDto)
    const [users, count] = await this.userRepository.findAndCount({
        where: {},
        skip,
        take: limit
    })
    return {
        pagination: paginationGenerator(count, page, limit),
        users
    }
}
async followers(paginationDto: PaginationDto) {
  const {limit, page, skip} = paginationSolver(paginationDto)
  const {id : userId} = this.request.user;
  const [followers, count] = await this.followRepository.findAndCount({
      where: {followingId : userId},//followingId of my followers it means me.take into request.user in the upper code.
      relations : {//relation on follower and take profile of them.
        follower : {
          profile : true
        }
      },
      select : {
        id : true ,
        follower : {
          id : true ,
          username : true ,
          profile : {//show this information of follower.**
            id : true ,
            nick_name : true , 
            bio : true ,
            image_profile : true ,
            backGround_profile : true
          }
        }
      },
      skip,
      take: limit
  })
  return {
      pagination: paginationGenerator(count, page, limit),
      followers
  }
}
async following(paginationDto: PaginationDto) {
  const {limit, page, skip} = paginationSolver(paginationDto)
  const {id : userId} = this.request.user;
  const [following, count] = await this.followRepository.findAndCount({
      where: {
          followerId : userId        //following means people I follow and,,i am their follower ID.my id in their followerId.
      },
      relations : {//relation on follower and take profile of them.
        following : {
          profile : true
        }
      },
      select : {
        id : true ,
        following : {
          id : true ,
          username : true ,
          profile : {//show this information of follower.**
            id : true ,
            nick_name : true , 
            bio : true ,
            image_profile : true ,
            backGround_profile : true
          }
        }
      },
      skip,
      take: limit
  })
  return {
      pagination: paginationGenerator(count, page, limit),
      following
  }
}
  profile() {
    const { id } = this.request.user;
    return this.userRepository.createQueryBuilder(EntitiName.User)
    .where({id})
    .leftJoinAndSelect('user.profile' , 'profile')
    .loadRelationCountAndMap('user.followers' , 'user.followers')//count and show number and list of followers.
    .loadRelationCountAndMap('user.following' , 'user.following')//count and show number and list of following.
    .getOne();
  }

  //first of all we take id into user request.
  //after that we conform and check email and id with finding email.
  async changeEmail(email: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ email });
    if (user && user?.id !== id) {
      throw new ConflictException('email used by another person');
    } else if (user && user.id == id) {
      //if email exactly that existed email we didnt change anything and remain.
      return {
        message: 'updated successfully', //we dont update or modify just show update message because the email not changed.
      };
    }
    await this.userRepository.update({id} , {new_email : email})
    const otp = await this.authService.saveOtp(id , AuthMethod.Email);
    const token = this.tokenService.createEmailToken({ email });
    return {
      code: otp.code,
      token,
    };
  }
  async verifyEmail(code: string) {
    const { id: userId , new_email } = this.request.user;
    const token = this.request.cookies?.[CookieKeys.EmailOTP];
    if (!token)
      throw new BadRequestException('code is expire please try again');
    const {email} = this.tokenService.verifyEmailToken(token);
    if(email !== new_email) {
      throw new BadRequestException('somthing wrong')
    }
    const otp = await this.checkOtp(userId, code);
    if(otp.method !== AuthMethod.Email) {
      throw new BadRequestException('somthing wrong')
    }
    await this.userRepository.update({id : userId} , {//now we update email of user and change their old email to new email.
      email ,
      verify_email : true ,
      new_email : null
    });
    return {
      message : 'email updated successfully' ,
    }
  }
  async changePhone(phone: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ phone });//search base on phone.
    if (user && user?.id !== id) {
      throw new ConflictException('phone number used by another user');
    } else if (user && user.id == id) {
      //if email exactly that existed email we didnt change anything and remain.
      return {
        message: 'updated successfully', //we dont update or modify just show update message because the email not changed.
      };
    }
    await this.userRepository.update({id} , {new_phone : phone})
    const otp = await this.authService.saveOtp(id , AuthMethod.Phone);
    const token = this.tokenService.createPhoneToken({ phone });
    return {
      code: otp.code,
      token,
    };
  }
  async verifyPhone(code: string) {
    const { id: userId , new_phone } = this.request.user;
    const token = this.request.cookies?.[CookieKeys.PhoneOTP];
    if (!token)
      throw new BadRequestException('code is expire please try again');
    const {phone} = this.tokenService.verifyPhoneToken(token);
    if(phone !== new_phone) {
      throw new BadRequestException('somthing wrong')
    }
    const otp = await this.checkOtp(userId, code);
    if(otp.method !== AuthMethod.Phone) {
      throw new BadRequestException('somthing wrong')
    }
    await this.userRepository.update({id : userId} , {//now we update email of user and change their old email to new email.
      phone ,
      verify_phone : true ,
      new_phone : null
    });
    return {
      message : 'phone updated successfully' ,
    }
  }
  async changeUsername(username: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ username });//search base on username.
    if (user && user?.id !== id) {
      throw new ConflictException('username used by another user');
    } else if (user && user.id == id) {
      //if email exactly that existed email we didnt change anything and remain.
      return {
        message: 'updated successfully', //we dont update or modify just show update message because the email not changed.
      };
    }
    await this.userRepository.update({id} , {username})
    return {
      message: 'updated successfully'
    }
  }
  async checkOtp(userId: number, code: string) {
    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new BadRequestException('not found please try agin!');
    const now = new Date();
    if (otp.expiresIn < now) throw new BadRequestException('code is expire!');
    if (otp.code !== code) throw new BadRequestException('please try agin!');
    return otp;
  }
  async followToggle(followingId : number) {
    const {id : userId} = this.request.user; 
    const following = await this.userRepository.findOneBy({id : followingId})
    if(!following) throw new NotFoundException('not found any user')
    const isFollowing = await this.followRepository.findOneBy({followingId , followerId : userId})
    let message = PublicMessage.Follow
    if(isFollowing) {
      message = PublicMessage.Unfollow
      await this.followRepository.remove(isFollowing)
    }else{
      await this.followRepository.insert({followingId , followerId : userId})
    }
    return {
      message
    }
  }
  async blockToggle(blockDto : UserBlockDto) {
    const {userId} = blockDto 
    const user = await this.userRepository.findOneBy({id : userId})//first we search for user
    if(!user) throw new NotFoundException('not found any user')//if not exist throw error
    let message = PublicMessage.Blocked
    if(user.status === UserStatus.Block) {//if user status is block
      message = PublicMessage.Unblocked //unblocked it
      await this.userRepository.update({id : userId} , {status : null})//and update it
    }else{
      await this.userRepository.update({id : userId} , {status : UserStatus.Block})//if not block it.
    }
    return {
      message
    }
  }
}
