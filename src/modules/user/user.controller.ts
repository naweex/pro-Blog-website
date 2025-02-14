import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFiles, ParseFilePipe, UseGuards, Res, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { ChangeEmailDto, ChangePhoneDto, ChangeUsernameDto, ProfileDto } from './dto/profile.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { multerDestination, multerFileName } from 'src/common/utils/multer.util';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProfileImage } from './types/files';
import { uploadedOptionalFiles } from 'src/common/decorators/upload-file.decorator';
import { Response } from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { CookiesOptionToken } from 'src/common/utils/cookie.util';
import { CheckOtpDto } from '../auth/dto/auth.dto';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { Pagination } from 'src/common/decorators/pagination.decorators';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth('Authorization')//for add authentication option in swagger.and should import this in user module.
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Put('/profile')
  //we use MultipartData because we upload file(background and profile image) in our profile.***
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(FileFieldsInterceptor([
  {name : 'image_profile' , maxCount : 1} ,
  {name : 'backGround_profile' , maxCount : 1}
] ,{
  storage : diskStorage({
    destination : multerDestination('user-profile') ,//put 2 file(bg-image,pro-image) in user-profile
    filename : multerFileName,
  })
}
))
  changeProfile(
    @uploadedOptionalFiles() files : ProfileImage ,//uploadedOptionalFiles is a costum decorator we made it.
    @Body() profileDto : ProfileDto){
    return this.userService.changeProfile(files , profileDto)
  }
    @Get('/profile')
    profile(){
      return this.userService.profile()
    }
    @Get('/list')
    @Pagination()
    @CanAccess(Roles.Admin)
    find(@Query() paginationDto : PaginationDto){
      return this.userService.find(paginationDto)
    }
    @Get('/followers')
    @CanAccess(Roles.Admin)
    followers(){
      return this.userService.find()
    }
    @Get('/following')
    @CanAccess(Roles.Admin)
    following(){
      return this.userService.find()
    }
    @Get('/follow/:followingId')
    @ApiParam({name : 'followingId'})
    follow(@Param('followingId' , ParseIntPipe) followingId : number){
      return this.userService.followToggle(followingId)
    }
    @Patch('/change-email')
    async changeEmail(@Body() emailDto : ChangeEmailDto , @Res() res : Response){
      const {code,token,message} = await this.userService.changeEmail(emailDto.email)
      if(message) return res.json({message})
      res.cookie(CookieKeys.EmailOTP , token , CookiesOptionToken()) 
      res.json({
        code ,
        message : 'otp send successfully'
    })
  }    
  @Post('/verify-email-otp')
  @ApiConsumes(SwaggerConsumes.UrlEncoded , SwaggerConsumes.Json)
  async verifyEmail(@Body() otoDto : CheckOtpDto){
    return this.userService.verifyEmail(otoDto.code)
}   
@Patch('/change-phone')
@ApiConsumes(SwaggerConsumes.UrlEncoded , SwaggerConsumes.Json)
async changePhone(@Body() phoneDto : ChangePhoneDto , @Res() res : Response){
  const {code,token,message} = await this.userService.changePhone(phoneDto.phone)
  if(message) return res.json({message})
  res.cookie(CookieKeys.PhoneOTP , token , CookiesOptionToken()) 
  res.json({
    code ,
    message : 'otp send successfully'
})
}    
@Post('/verify-phone-otp')
@ApiConsumes(SwaggerConsumes.UrlEncoded , SwaggerConsumes.Json)
async verifyPhone(@Body() otoDto : CheckOtpDto){
return this.userService.verifyPhone(otoDto.code)
}   
@Patch('/change-username')
@ApiConsumes(SwaggerConsumes.UrlEncoded , SwaggerConsumes.Json)
async changeUsername(@Body() usernameDto : ChangeUsernameDto){
return this.userService.changeUsername(usernameDto.username)
}   
}
