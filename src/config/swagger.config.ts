import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject, SecuritySchemeType } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
//this is swagger config and use this function in main.ts and config it for all project.
export function swaggerConfigInit(app : INestApplication) : void {
    const document = new DocumentBuilder()
    .setTitle('Blog website')
    .setDescription('Blog website Back-End')
    .setVersion('v0.0.1')
    .addBearerAuth(swaggerAuthConfig() , 'Authorization')
    .build()
    const swaggerDocument = SwaggerModule.createDocument(app , document);
    SwaggerModule.setup('/swagger' ,app , swaggerDocument)
}
//for set header
function swaggerAuthConfig() : SecuritySchemeObject {
    return {
        type : 'http' ,
        bearerFormat : 'JWT' , 
        in : 'header' ,
        scheme : 'bearer'
    }
}