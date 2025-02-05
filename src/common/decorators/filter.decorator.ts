import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

//this is a costum decorator.
export function FilterBlog (){
    return applyDecorators(
        ApiQuery({name : 'category' , required : false}) ,
        ApiQuery({name : 'search' , required : false}) ,
    )
}