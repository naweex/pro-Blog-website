import { Request } from "express";
import { mkdirSync } from "fs";
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
        const ext = extname(file.originalname); //we give original name of file/Name of the file on the uploader's computer.
        const filename = `${Date.now()}.${ext}`
        callback(null , filename)
    }

