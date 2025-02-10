import { BadRequestException } from "@nestjs/common";
import { Request } from "express";
import { mkdirSync } from "fs";
import { diskStorage } from "multer";
import { extname, join } from "path";

export type CallbackDestination = (error : Error , destination : string) => void
export type CallbackFilename = (error : Error , filename : string) => void
export function multerDestination(fieldName : string) {
    return function(req : Request , file : Express.Multer.File , callback : CallbackDestination):void{
        let path = join('public' , 'uploads' , fieldName)//in public folder create upload file.
        mkdirSync(path , {recursive : true}) //if path not exst create it.
        callback(null , path)//error = null , destination = path
    }
}
//we base on format and new date create new name for new uploaded file.
export function multerFileName(req : Request , file : Express.Multer.File , callback : CallbackFilename):void{
        const ext = extname(file.originalname).toLowerCase(); //we give original name of file/Name of the file on the uploader's computer.
        if(!['.png' , '.jpg' , '.jpeg'].includes(ext)){
            callback(new BadRequestException('image format should jpeg,jpg or png') , null)
        }else{
            const filename = `${Date.now()}${ext}`
            callback(null , filename)
        }   
    }
    export function multerStorage(folderName: string) {
        return diskStorage({
            destination: multerDestination(folderName),
            filename: multerFileName
        })
    }
    

