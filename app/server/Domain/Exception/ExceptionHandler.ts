import Exception from './Exception';
import { Socket } from 'socket.io';
import { execArgv } from 'process';
class ExceptionHandler{
    static handle(exception: Exception,socket: Socket){
        console.log(exception);
        switch(exception.status){
            case 422:
                //ドメイン例外の処理
                socket.emit('occurred:domain-exception',exception.message);
                break;
            case 401:
                //認証例外の処理
                socket.send(exception);
                break;
            default:
                //想定外のエラー
                //記録と通知を行う
                break;
        }
    }
}
export default ExceptionHandler;