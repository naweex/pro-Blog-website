import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { isJWT } from 'class-validator';
import { NextFunction, Request } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import { SKIP_AUTH } from '../decorators/skip-auth.decorators';
//with NestMiddleware we able to use middlewares and then we should follow the structure of below.
@Injectable()
export class AddUserToReqWov implements NestMiddleware {
  constructor(
    private authService: AuthService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractToken(req);
    if(!token) return next();
    try {
        let user = await this.authService.validateAccessToken(token);
        if(user) req.user = user;
    } catch (error) {
        console.log(error);
        
    }
    next();
  }
  //Private methods/members are accessible only from inside the class.
  //Protected methods/members are accessible from inside the class and extending class as well.
  protected extractToken(request: Request) {
    const { authorization } = request.headers;
    if (!authorization || authorization?.trim() == '') {
        return null;
    }
    const [bearer, token] = authorization?.split(' ');
    if (bearer?.toLowerCase() !== 'bearer' || !token || !isJWT(token)) {
      return null;
    }
    return token;
  }
}
