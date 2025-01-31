//we develope ProccessEnv interface in nodejs namespace.
namespace NodeJS {
    interface ProcessEnv {
        //Application
        PORT:number 
        //Database
        DB_PORT:number
        DB_NAME:string
        DB_USERNAME:string
        DB_PASSWORD:string
        DB_HOST:string
        //secret
        COOKIE_SECRET:string
        OTP_TOKEN_SECRET: string
        ACCESS_TOKEN_SECRET: string
        EMAIL_TOKEN_SECRET: string
        PHONE_TOKEN_SECRET: string
    }
}
//WE IMPROVE OUR APPLICATION SECURITY WITH SEPARATE access tokens,
//one type code for phone verification and another for email.