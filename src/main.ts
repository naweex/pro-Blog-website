import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { swaggerConfigInit } from './config/swagger.config';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  swaggerConfigInit(app);
  app.useStaticAssets('public')
  app.useGlobalPipes(new ValidationPipe())//because validation of dtos work.
  app.use(cookieParser(process.env.COOKIE_SECRET))
  const {PORT} = process.env;
  await app.listen(PORT , ()=> {
    console.log(`http://localhost${PORT}`);
    console.log(`SWAGGER : http://localhost${PORT}/swagger`);
  });
}
bootstrap();
