import RoomController from '../Domain/Controller/RoomController';
import { DISCONNECTED_REASON, ROOM_TYPE } from '../Enum/Enum';
import { Socket } from 'socket.io';
import logger from '../Domain/Utility/logger';
import { loginManager } from '../Domain/User/LoginManager';

module.exports = (socket: Socket) => {

    //切断中まだ切断されていない
    socket.on('disconnecting', (reason: string) => {
        logger.info('切断中...:', socket.id);
        switch (reason) {

            //クライアントからのログアウト命令で切断
            case DISCONNECTED_REASON.CLIENT_NAMESPACE_DISCONNECT:
                loginManager.getAfterLoginManager(socket).logout();
                break;

            //接続切り替え(wifi -> 4G or 5G 等)による切断
            case DISCONNECTED_REASON.TRANSPORT_CLOSE:
                //再接続命令送る
                break;
        }
    });

    //切断
    socket.on('disconnect', (reason: string) => {
        logger.info('切断完了...:', reason, socket.id);
    });


};
