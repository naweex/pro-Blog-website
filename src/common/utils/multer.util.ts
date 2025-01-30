import { Request } from "express";
import { mkdirSync } from "fs";
import { join } from "path";
export type CallbackFunction = (error : Error , destination : string) => void
export function multerDestination(fieldName : string) {
    return function(req : Request , file : Express.Multer.File , callback : CallbackFunction):void{
        let path = join('public' , 'uploads' , fieldName)//in public folder create upload file.
        mkdirSync(path , {recursive : true}) //if path not exst create it
    }

}