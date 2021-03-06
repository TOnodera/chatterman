import Exception from './Exception';
import { Socket } from 'socket.io';
import logger from '../Utility/logger';

class SocketExceptionHandler {
    static handle(exception: Exception, socket: Socket) {
        logger.error(exception.message, exception.status);
        switch (exception.status) {
            case 422:
                //ドメイン例外の処理
                logger.info(exception.message, exception.status);
                socket.emit('occurred:domain-exception', exception.message);
                break;
            case 401:
                //認証例外の処理
                logger.info(exception.message, exception.status);
                socket.emit('occurred:authentication-exception', exception.message);
                break;
            default:
                //想定外のエラー
                //記録と通知を行う
                logger.warn(exception.message, exception.status, exception.stack);
                break;
        }
    }
}
export default SocketExceptionHandler;
