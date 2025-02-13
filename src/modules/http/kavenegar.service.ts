import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { catchError, lastValueFrom, map } from "rxjs";
import * as querystring from 'qs'
import { SmsTemplate } from "./enum/sms-template.enum";
@Injectable()
export class KavenegarService {
constructor(private httpService : HttpService){}
    async sendVerificationSms(receptor : string , code : string) {
        const params = querystring.stringify({
        receptor ,
        token : code ,
        template : SmsTemplate.Verify
    })   //example:https://api.kavenegar.com/v1/{API-KEY}/verify/lookup.json?receptor=09*********&token=852596&template=myverification
        const {SEND_SMS_URL} = process.env                       //smsURL?params=jakhfuehfd
        const result = await lastValueFrom(//lastvaluefrom take last value from http request.
            this.httpService.get(`${SEND_SMS_URL}?${params}`)
            .pipe(
                map(res => res.data)
            )
            .pipe(//with catcherror we can access to errors in axios***
                catchError(err => {
                    console.log(err);
                    throw new InternalServerErrorException('kavenegar')
                    
                })
            )
        );
        console.log(result);
        return result
         
    }
}