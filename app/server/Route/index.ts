import { Request, Response } from "express";
import logger from "../Domain/Utility/logger";

const route = (app: any)=>{
    app.post("/api/users",(req: Request,res: Response)=>{
        
    });
    app.post("/api/login",(req: Request,res: Response)=>{
        
    });
}

export default route;