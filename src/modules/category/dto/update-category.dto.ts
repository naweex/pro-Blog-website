import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
//***maybe in create dtos some property should required but in update every properties are optional.***
//partialtype do this action in nestJS AND library of swagger.
