import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEmail, IsEnum, IsMobilePhone, IsOptional, IsPhoneNumber, Length } from "class-validator"
import { Gender } from "../enums/gender.enum"
//in this file every fields in profile are optional and user can change their>>>
//so we use apipropertyoptional.
export class ProfileDto {
        @ApiPropertyOptional()
        @IsOptional()
        @Length(3 , 50)
        nick_name : string
        @ApiPropertyOptional({nullable : true})
        @IsOptional()
        @Length(10 , 200) //minimum 10 maximum 200 character should exist in bio.**
        bio : string
        @ApiPropertyOptional({nullable : true , format : 'binary'})
        image_profile : string
        @ApiPropertyOptional({nullable : true , format : 'binary'})
        backGround_profile : string
        @ApiPropertyOptional({nullable : true , enum : Gender})
        @IsOptional()   
        @IsEnum(Gender)
        gender : string
        @ApiPropertyOptional({nullable : true , example : '2025-01-29T14:56:54.106Z'})
        birthday : Date
        @ApiPropertyOptional({nullable : true})
        linkedin_profile : string
        @ApiPropertyOptional({nullable : true})
        x_profile : string
}

export class ChangeEmailDto {
        @ApiProperty()
        @IsEmail({} , {message : 'email is invalid'})
        email : string
}
export class ChangePhoneDto {
        @ApiProperty()
        @IsMobilePhone('fa-IR' , {} , {message : 'mobile number format is invalid'})
        phone : string
}