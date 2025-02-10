import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageDto } from './dto/image.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadFile } from 'src/common/interceptor/upload.interceptor';
import { MulterFile } from '../user/types/files';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

@Controller('image')
@ApiTags('image')
@ApiBearerAuth('Authorization')//for add authentication option in swagger.and should import this in image module.
@UseGuards(AuthGuard)
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(UploadFile('image'))
  @ApiConsumes(SwaggerConsumes.MultipartData)
  create(@Body() imageDto: ImageDto , @UploadedFile() image : MulterFile) {
    return this.imageService.create(imageDto , image);
  }

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}
