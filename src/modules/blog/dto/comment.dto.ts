import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, isNumber, IsNumberString, isNumberString, IsOptional, Length } from "class-validator";

export class CreateCommentDto {
    @ApiProperty()
    @Length(5)
    text : string
    @ApiProperty()
    @IsNumberString()
    blogId : number
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    parentId : number
}