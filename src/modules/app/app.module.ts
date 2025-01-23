import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TypeOrmConfig } from 'src/config/typeorm.config';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true ,
      envFilePath : join(process.cwd() , '.env') //we recognation .env to proccess.cwd and join them with each other.
    }),
    TypeOrmModule.forRoot(TypeOrmConfig())
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}











