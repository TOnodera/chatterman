import { DISCONNECTED_REASON } from '../Enum/Enum';
import { Socket } from 'socket.io';
import logger from '../Domain/Utility/logger';
import { loginManager } from '../Domain/User/LoginManager';
import socketService from '../Domain/Utility/SocketService';

module.exports = (socket: Socket) => {

    //切断中
    const disconnectingListener = (reason: string) => {
        logger.info('切断中...:', socket.id);
        switch (reason) {

            //クライアントからのログアウト命令で切断
            case DISCONNECTED_REASON.CLIENT_NAMESPACE_DISCONNECT:
                loginManager.getAfterLoginManager(socket).logout();
                break;

            //接続切り替え(wifi -> 4G or 5G 等)による切断
            case DISCONNECTED_REASON.TRANSPORT_CLOSE:
                break;
        }
    }

    //切断
    const disconnectedListener = (reason: string) => {
        logger.info('切断完了...:', reason, socket.id);
    };

    socketService.registeOnce('disconnecting', disconnectingListener, socket);
    socketService.registeOnce('disconnected', disconnectedListener, socket);

};
