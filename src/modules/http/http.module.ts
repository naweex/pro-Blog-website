import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { KavenegarService } from "./kavenegar.service";
@Global()//this module able to use all over the project.
@Module({
    imports : [HttpModule.register({
        timeout : 10000 , //if 10 second past from request failed it.//axios confique.
    })] ,
    providers : [KavenegarService] ,
    exports : [KavenegarService] ,
})
export class CustomHttpModule {

}
//add http module into app.module(main module)