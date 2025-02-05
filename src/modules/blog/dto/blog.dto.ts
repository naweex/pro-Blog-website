import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumberString, Length } from "class-validator";

export class CreateBlogDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(10 , 100)
    title : string;
    @ApiPropertyOptional()//if slug not exist we use title.
    slug : string;
    @ApiProperty()
    @IsNotEmpty()
    @IsNumberString()
    time_for_study: string;
    @ApiPropertyOptional()
    image : string;
    @ApiProperty()
    @IsNotEmpty()
    @Length(10 , 300)
    description : string;
    @ApiProperty()
    @IsNotEmpty()
    @Length(100)
    content : string;
    @ApiProperty({type : String , isArray : true})
    //@IsArray()
    categories : string[] | string

}
//title and description is very important for seo,always should exist in blogs and shouldnt be optional.
//seo : key word , meta description , meta title ,
//slugify is a npm package that replace space with somthing we want.

export class FilterBlogDto {
    category : string;
    search : string;
}