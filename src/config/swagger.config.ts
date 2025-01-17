import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
//this is swagger config and use this function in main.ts and config it for all project.
export function swaggerConfigInit(app : INestApplication) : void {
    const document = new DocumentBuilder()
    .setTitle('Blog website')
    .setDescription('Blog website Back-End')
    .setVersion('v0.0.1')
    .build()
    const swaggerDocument = SwaggerModule.createDocument(app , document);
    SwaggerModule.setup('/swagger' ,app , swaggerDocument)
}