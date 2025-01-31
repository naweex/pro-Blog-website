import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFiles, ParseFilePipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from './dto/profile.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { multerDestination, multerFileName } from 'src/common/utils/multer.util';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProfileImage } from './types/files';
import { uploadedOptionalFiles } from 'src/common/decorators/upload-file.decorator';

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


  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
