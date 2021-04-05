import { Request, Response } from "express";
import UserController from "../Domain/Controller/UserController";
import HttpExceptionHandler from "../Domain/Exception/HttpExceptionHandler";
import { UserRegisteInfo } from "server/@types/types";

const route = (app: any)=>{

    app.post("/api/users",async (req: Request,res: Response)=>{
        try{
            const userInfo:UserRegisteInfo = req.body;
            await UserController.registe(userInfo);
            res.json({registered:true});
        }catch(e){
            HttpExceptionHandler.handle(e,res);
        }
    });

    app.post("/api/login",async (req: Request,res: Response)=>{
        const credentials: Credentials = req.body;
        try{
            await UserController.login(credentials);
            res.json({attempt: true});
        }catch(e){
            HttpExceptionHandler.handle(e,res);
        }
    });

}

export default route;