import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";
import { AuthService } from "../auth.service";
import { Reflector } from "@nestjs/core";
import { SKIP_AUTH } from "src/common/decorators/skip-auth.decorators";

@Injectable()
export class AuthGuard implements CanActivate {//with Reflector we can access metaData.***
    constructor(private authService : AuthService , private reflector : Reflector){}
    async canActivate(context: ExecutionContext){
        const isSkippedAuthorization = this.reflector.get<boolean>(SKIP_AUTH , context.getHandler());
        if(isSkippedAuthorization) return true;
        const httpContext = context.switchToHttp();
        const request : Request = httpContext.getRequest<Request>();
        const token = this.extractToken(request)
        request.user = await this.authService.validateAccessToken(token)
        return true;
    }
    //Private methods/members are accessible only from inside the class.
    //Protected methods/members are accessible from inside the class and extending class as well.
    protected extractToken(request : Request){
        const { authorization } = request.headers;
        if(!authorization || authorization?.trim() == ""){
            throw new UnauthorizedException('please login to your current account')
        }
        const [bearer , token] = authorization?.split(" ")
        if(bearer?.toLowerCase() !== 'bearer' || !token || !isJWT(token)){
            throw new UnauthorizedException('please login to your current account')
        }
        return token;
    }
}