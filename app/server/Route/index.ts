import { Request, Response } from "express";
import userManager from '../Domain/User/UserManager';
import HttpExceptionHandler from "../Domain/Exception/HttpExceptionHandler";
import logger from "../Domain/Utility/logger";
import { loginManager } from '../Domain/User/LoginManager';

const route = (app: any)=>{

    app.post("/api/users",async (req: Request,res: Response)=>{
        try{
            logger.info('HTTPリクエスト受信 UserControllerに処理委譲');
            const userInfo:UserRegisteInfo = req.body;
            await userManager.registe(userInfo);
            res.json({registered:true});
            logger.info('HTTPレスポンス送信');
        }catch(e){
            HttpExceptionHandler.handle(e,res);
        }
    });

    app.post("/api/login",async (req: Request,res: Response)=>{
        const credentials: Credentials = req.body;
        try{
            logger.info('HTTTPリクエスト受信  UserContorollerに処理委譲');
            await loginManager.login(credentials);
            res.json({attempt: true});
            logger.info('HTTPレスポンス送信');
        }catch(e){
            HttpExceptionHandler.handle(e,res);
        }
    });

}

export default route;