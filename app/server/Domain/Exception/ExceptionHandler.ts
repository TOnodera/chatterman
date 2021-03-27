import Exception from './Exception';
import AuthenticationException from './AuthenticationException';
import DomainException from './DomainException';
import { Socket } from 'socket.io';
class ExceptionHandler{
    static handle(exception: Exception,socket: Socket){
        switch(exception.status){
            case 422:
                //ドメイン例外の処理
                socket.emit('occurred:domain-exception',exception.message);
                console.log(exception.message);
                break;
            case 401:
                //認証例外の処理
                socket.send(exception.message);
                break;
            default:
                //想定外のエラー
                //記録と通知を行う
                console.log(exception);
                break;
        }
    }
}
export default ExceptionHandler;