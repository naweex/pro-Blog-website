import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumberString, isNumberString, IsOptional, Length } from "class-validator";

export class CreateCommentDto {
    @ApiProperty()
    @Length(5)
    text : string
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    parentId : number
}