import { DISCONNECTED_REASON } from '../Enum/Enum';
import { Socket } from 'socket.io';
import logger from '../Utility/logger';
import { loginManager } from '../Domain/User/Login/LoginManager';
import socketService from '../Utility/SocketService';
import loginUserStore from '../Store/LoginUsersStore';

module.exports = (socket: Socket) => {

    //切断中
    const disconnectingListener = (reason: string) => {

        switch (reason) {

            //ブラウザを閉じる、タブを閉じるなどで切断
            //ログアウト時にdisconnectイベント発動された場合
            case DISCONNECTED_REASON.CLIENT_NAMESPACE_DISCONNECT:
            case DISCONNECTED_REASON.SERVER_NAMESPACE_DISCONNECT:
                loginManager.getAfterLoginManager(socket).logout();
                break;

            //接続切り替え(wifi -> 4G or 5G 等)による切断
            case DISCONNECTED_REASON.TRANSPORT_CLOSE:
                break;

            default:
                logger.error(reason);
        }

        //ソケットとユーザーの紐付けMapから切断されたソケットを削除
        loginUserStore.delete(socket.id);
    }

    const userLogoutListener = () => {
        socket.disconnect();
    }

    //disconnectingイベント完了後に発動
    const disconnectedListener = (reason: string) => {
        logger.info('切断完了...:', reason, socket.id);
    };

    socketService.registeOnce('disconnecting', disconnectingListener, socket);
    socketService.registeOnce('disconnected', disconnectedListener, socket);
    socketService.registeOnce('user:logout', userLogoutListener, socket);
    console.log(userLogoutListener);

};
