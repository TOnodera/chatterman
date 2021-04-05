import { Request, Response } from "express";
import logger from "../Domain/Utility/logger";
import UserController from "../Domain/Controller/UserController";
import HttpExceptionHandler from "../Domain/Exception/HttpExceptionHandler";

const route = (app: any)=>{
    app.post("/api/users",(req: Request,res: Response)=>{
        logger.debug(req.body);
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