import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import config from "../config";


export enum userRole {
    ADMIN = "ADMIN",
    TUTOR = "TUTOR",
    STUDENT = "STUDENT"
}


const auth = (...roles:userRole[]) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        // next()
        try {
            const tokenHeader = req.headers.authorization;
            if (!tokenHeader) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized token is missing'
                })
            }

            const token = tokenHeader.split(" ")[1]

            const decodedToken = jwt.verify(token, config.jwt_secret as string) as JwtPayload
            const userData = await prisma.user.findUnique({
                where: {
                    email: decodedToken.email
                }
            })
            if (!userData) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized user does not exist'
                })
            }
            // if(userData.status!== "active"){
            //     return res.status(401).json({
            //         success: false,
            //         message: 'Unauthorized user is not active'
            //     })
            // }
            (req as any).user = userData;

            if (roles.length > 0 && !roles.includes(userData.role as userRole)) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden user does not have the required role'
                })
            }
      
            req.user = decodedToken

            next()
        } catch (error: any) {
            // return res.status(401).json({
            //     success:false,
            //     message:'Unauthorized token is invalid'
            // })
            next(error)
        }
    }
}
export default auth;    