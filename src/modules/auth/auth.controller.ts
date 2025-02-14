import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto, CheckOtpDto } from './dto/auth.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';


@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('user-existence')
  @ApiConsumes(SwaggerConsumes.UrlEncoded , SwaggerConsumes.Json)
  UserExistence(@Body() authDto : AuthDto , @Res() res : Response){
    return this.authService.UserExistence(authDto , res)
  }
  @Post('check-otp')
  @ApiConsumes(SwaggerConsumes.UrlEncoded , SwaggerConsumes.Json)
  checkOtp(@Body() checkOtpDto : CheckOtpDto){
    return this.authService.checkOtp(checkOtpDto.code)
  }
  @Get('check-login')
  @AuthDecorator()                    //can access when we only give admin permission worked else user.
  @CanAccess(Roles.Admin , Roles.User)//admin and user can access this route.
  checkLogin(@Req() req : Request){
    return req.user;
  }
}
