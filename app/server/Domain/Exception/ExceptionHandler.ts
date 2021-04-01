import Exception from './Exception';
import { Socket } from 'socket.io';

class ExceptionHandler{
    static handle(exception: Exception,socket: Socket){
        console.log(exception.message);
        switch(exception.status){
            case 422:
                //ドメイン例外の処理
                socket.emit('occurred:domain-exception',exception.message);
                break;
            case 401:
                //認証例外の処理
                socket.send('occurred:authentication-exception',exception.message);
                break;
            default:
                //想定外のエラー
                //記録と通知を行う
                break;
        }
    }
}
export default ExceptionHandler;