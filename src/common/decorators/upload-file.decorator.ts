import { applyDecorators, ParseFilePipe, UploadedFiles } from "@nestjs/common";
//with applyDeocrator we can create optionals decorators.
export function uploadedOptionalFiles(){
    return UploadedFiles(new ParseFilePipe({//parsefilepipe for upload file filtering.
      fileIsRequired : false ,
      validators : []
    }))
}
    
    
    
    
