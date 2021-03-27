import Exception from './Exception';
import AuthenticationException from './AuthenticationException';
import DomainException from './DomainException';
import { Socket } from 'socket.io';
class ExceptionHandler{
    static handle(exception: Exception,socket: Socket){
        switch(true){
            case exception instanceof DomainException:
                //ドメイン例外の処理
                socket.send(exception.message);
                console.log('domain exception...')
                break;
            case exception instanceof AuthenticationException:
                //認証例外の処理
                socket.send(exception.message);
                break;
            default:
                //想定外のエラー
                //記録と通知を行う
                console.log("例外",exception instanceof DomainException);
                break;
        }
    }
}
export default ExceptionHandler;