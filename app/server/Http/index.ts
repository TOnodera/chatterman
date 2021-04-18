import { Request, Response } from 'express';
import UserController from '../Controller/UserController';
import HttpExceptionHandler from '../Exception/HttpExceptionHandler';
import logger from '../Domain/Utility/logger';
import { loginManager } from '../Domain/User/LoginManager';

const route = (app: any) => {
    app.post('/api/users', async (req: Request, res: Response) => {
        try {
            logger.info('HTTPリクエスト受信 UserControllerに処理委譲');
            const userInfo: UserRegisteInfo = req.body;
            await UserController.registe(userInfo);
            res.json({ registered: true });
            logger.info('HTTPレスポンス送信');
        } catch (e) {
            HttpExceptionHandler.handle(e, res);
        }
    });

    app.post('/api/login', async (req: Request, res: Response) => {
        const credentials: Credentials = req.body;
        try {
            logger.info('HTTTPリクエスト受信  UserContorollerに処理委譲');
            if (await loginManager.login(credentials)) {
                req.session.regenerate(() => {
                    req.session.credentials = credentials;

                    res.json({ attempt: true });
                });
            }
        } catch (e) {
            HttpExceptionHandler.handle(e, res);
        }
    });
};

export default route;
