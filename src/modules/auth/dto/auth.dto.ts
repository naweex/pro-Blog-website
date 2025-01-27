import { ApiProperty } from "@nestjs/swagger";
import { AuthType } from "../enums/type.enum";
import { IsEnum, IsString, Length } from "class-validator";
import { AuthMethod } from "../enums/method.enum";

export class AuthDto {
    @ApiProperty()//with this decorator we can show variable in below in swagger.
    @IsString()
    @Length(3 , 100)
    username : string;
    @ApiProperty({enum : AuthType})
    @IsEnum(AuthType)
    type : string;
    @ApiProperty({enum : AuthMethod})
    @IsEnum(AuthMethod)
    method : AuthMethod;
}
export class CheckOtpDto {
    @ApiProperty()//with this decorator we can show variable in below in swagger.
    @IsString()
    @Length(5 , 5)
    code : string;
}

//enum means specific type or sum ,when our type is enum our variable always give specific amount.
