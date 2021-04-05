import Exception from './Exception';
import logger from '../Utility/logger';
import { Response } from 'express';

class HttpExceptionHandler{
    static handle(exception: Exception,res: Response){
        logger.error(exception.message,exception.status);
        switch(exception.status){
            case 422:
                //ドメイン例外の処理
                res.json({message:exception.message,status:exception.status});
                break;
            case 401:
                //認証例外の処理
                res.json({message:exception.message,status:exception.status});
                break;
            default:
                //想定外のエラー
                //記録と通知を行う
                break;
        }
    }
}
export default HttpExceptionHandler;