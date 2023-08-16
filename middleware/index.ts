import jwt from 'jsonwebtoken'
import { Response } from 'express'
import { NextFunction } from 'express-serve-static-core';
export const SECRET = 'SEC3t'
export const USER_SECRET = 'SECUSER3T'

//generate jwt for sign up,
//export const authenticateJwt = () => (req:Request, res:Response,next:NextFunction)=>{
    export   const authenticateJwt = (req:any, res:any, next:any) => {   
console.log("inside middlewate")
    let authHeader = req.headers.authorization;
    console.log("authHeader inside middlewate", authHeader)

    if(authHeader){
        console.log("inside authHeader")
        let token = authHeader.split(" ")[1];
        jwt.verify(token, SECRET,(err: any, user: any)=>{
            if(err){
                return res.status(403).json({message:"forbiddeb: {}",err})
                //return res.sendStatus(403)
            }else{
              console.log(user)
              req.userId = user.id 
              next()
            }

        })
    }else{
        console.log("inside authHeader else")
        res.sendStatus(400)
    }
}

export const userAuthenticateJwt = (req:any, res:any, next:any)=>{
    const authHeader = req.headers.authorization;
    if(authHeader){
        let token = authHeader.split(" ")[1]
        jwt.verify(token, USER_SECRET,(err:any, user:any)=>{
            if(err){
                return res.status(403).json({message:"forbidden",err})
            }
            console.log("user in user authenticate", user)
            req.userId=user.id;
            next();
        })
    }  else{
        return res.status(400).json({message:"authentication not provided"})
    } 


}

