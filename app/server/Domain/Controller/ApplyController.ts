import loginManager from "../User/LoginManager";
import Exception from "../Exception/Exception";
import logger from "../Utility/logger";
import { SendMessageToClient, UserBasicInfo } from "server/@types/types";
import apply from '../Apply/Apply';
import { Socket } from "socket.io";
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";
import messageManager from '../Message/MessasgeManager';


class ApplyController {

    async apply(target_id: string, info: UserBasicInfo, socket: Socket) {

        logger.info(`1/2 ApplyController.apply() -> 処理開始 target_id: ${target_id}, request_user: ${info.credentials.email}`);

        if (await loginManager.authenticate(info.credentials) == false) {
            throw new Exception("認証情報がない状態でDM申請を行ないました。不正な操作です。");
        }

        try {

            if (await apply.hasAccepted(target_id, info.user.id)) {
                socket.emit('user:already-application-is-accepted', 'DM送信の申請を受信しています。詳しくはお知らせを確認して下さい。');
                return;
            }

            if (await apply.hasAlreadyRequested(target_id, info.user.id)) {
                socket.emit('user:already-requested', '申請を既に送信しています。許可されるのをお待ち下さい。');
                return;
            }

            await apply.apply(target_id, info.user.id);
            const information_room = await apply.getUserinformationRoomId(target_id);
            const toClient:SendMessageToClient = await messageManager.addAsSuperUser(`${info.user.name}さんからダイレクトメッセージの許可申請が届きました。`, information_room);

             //ログイン中のユーザーに該当するユーザーがいる場合はソケット取得してメッセージ送信
             const socket_id: any = loginManager.getSocketFromUserId(target_id);
             if(socket_id){
                 socket.to(information_room).emit('user:get-apply-resuest',toClient);
             }

        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }

        socket.emit('user:apply-resuest-has-sent', '許可申請を送りました。承認されるまでお待ち下さい。');

        logger.info(`2/2 ApplyController.apply() -> 処理完了 request_user: ${info.credentials.email}`);

    }
}

export default new ApplyController;