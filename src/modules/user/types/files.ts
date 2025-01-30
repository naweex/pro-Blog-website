export type MulterFile = Express.Multer.File
export type ProfileImage = {
    image_profile : MulterFile[] ,
    backGround_profile : MulterFile[] ,
}