import { ServerResponse } from "node:http";

//Sends an error response 
//status code such as 400,404 ,500
export const errorResponse=(res:ServerResponse,statusCode:number,message:string)=>{
    res.writeHead(statusCode,{"content-type":"application/json"})
    res.end(JSON.stringify({error:message}))
}

//Sends any success response 
export const successResponse=(res:ServerResponse,statusCode:number,data:any)=>{
    res.writeHead(statusCode,{"content-type":"application/json"})
    //status code for deleting item as it doesn't return any response or message.
    if(statusCode === 204){
        res.end()
        return;
    }
    res.end(JSON.stringify(data))
}