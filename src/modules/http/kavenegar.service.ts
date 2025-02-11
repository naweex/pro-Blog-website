import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
@Injectable()
export class KavenegarService {
constructor(private httpService : HttpService){}
    async sendVerificationSms(params : string) {
        
    }
}