import Exception from './Exception';
import logger from '../Utility/logger';
import { Response } from 'express';

class HttpExceptionHandler {
    static handle(exception: Exception, res: Response) {
        switch (exception.status) {
            case 422:
                //ドメイン例外の処理
                logger.info(exception.message, exception.status);
                res.json({ message: exception.message, status: exception.status });
                break;
            case 401:
                //認証例外の処理
                logger.info(exception.message, exception.status);
                res.json({ message: exception.message, status: exception.status });
                break;
            default:
                //想定外のエラー
                logger.warn(exception.message, exception.status, exception.stack);
                break;
        }
    }
}
export default HttpExceptionHandler;
