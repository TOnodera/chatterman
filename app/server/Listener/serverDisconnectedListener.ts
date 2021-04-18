import { DISCONNECTED_REASON } from '../Enum/Enum';
import { Socket } from 'socket.io';
import logger from '../Utility/logger';
import { loginManager } from '../Domain/User/Login/LoginManager';
import socketService from '../Utility/SocketService';
import loginUserStore from '../Store/LoginUsersStore';

module.exports = (socket: Socket) => {

    //切断中
    const disconnectingListener = async (reason: string) => {

        switch (reason) {
            //クライアントからのログアウト命令で切断
            case DISCONNECTED_REASON.CLIENT_NAMESPACE_DISCONNECT:
                await loginManager.getAfterLoginManager(socket).logout();
                break;

            //接続切り替え(wifi -> 4G or 5G 等)による切断
            case DISCONNECTED_REASON.TRANSPORT_CLOSE:
                break;

            default:
                logger.error(reason);
        }
        logger.info(`${socket.id}の切断処理開始`);
        logger.info(`ソケット接続状況 -> `, loginUserStore.users.has(socket.id));
        //ソケットとユーザーの紐付けMapから切断されたソケットを削除
        loginUserStore.delete(socket.id);
        logger.info(`ソケット接続状況 -> `, loginUserStore.users.has(socket.id));
        logger.info(`${socket.id}処理完了`);
    }

    //切断
    const disconnectedListener = (reason: string) => {
        logger.info('切断完了...:', reason, socket.id);
    };

    socketService.registeOnce('disconnecting', disconnectingListener, socket);
    socketService.registeOnce('disconnected', disconnectedListener, socket);

};
