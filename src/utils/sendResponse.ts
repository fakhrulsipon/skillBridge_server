import { Response } from "express";

type TResponse<T> = {
    statusCode:number;
    success:boolean;
    message:string;
    data?:T
}

const sendResponse = <T>(res:Response, data:TResponse<T>)=>{
    const {statusCode, success, message,data:DataResponse}= data;
    res.status(statusCode as number).json({
        success,
        message,
        data:DataResponse
    })
}

export default sendResponse;