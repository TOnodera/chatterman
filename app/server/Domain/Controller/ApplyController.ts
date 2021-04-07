import loginManager from "../User/LoginManager";
import Exception from "../Exception/Exception";
import logger from "../Utility/logger";
import { UserBasicInfo } from "server/@types/types";
import apply from '../Apply/Apply';
import { Socket } from "socket.io";
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";
import messageController from './MessasgeController';

class ApplyController {

    async apply(target_id: string, info: UserBasicInfo, socket: Socket) {

        logger.info(`1/6 ApplyController.apply() -> 処理開始 target_id: ${target_id}, request_user: ${info.credentials.email}`);
        if (await loginManager.authenticate(info.credentials) == false) {
            throw new Exception("認証情報がない状態でDM申請を行ないました。不正な操作です。");
        }

        try {

            logger.info(`2/6 ApplyController.apply() -> target_idからの受信済みのDM申請がないか確認 request_user: ${info.credentials.email}`);
            if (await apply.hasAccepted(target_id, info.user.id)) {
                socket.emit('user:already-application-is-accepted', 'DM送信の申請を受信しています。詳しくはお知らせを確認して下さい。');
                return;
            }

            logger.info(`3/6 ApplyController.apply() -> target_idへの送信済みのリクエストがないか確認 request_user: ${info.credentials.email}`);
            if (await apply.hasAlreadyRequested(target_id, info.user.id)) {
                socket.emit('user:already-requested', '申請を既に送信しています。許可されるのをお待ち下さい。');
                return;
            }

            logger.info(`4/6 ApplyController.apply() -> 申請メイン処理開始 request_user: ${info.credentials.email}`);
            await apply.apply(target_id, info.user.id);

            logger.info(`5/6 ApplyController.apply() -> 申請メッセージを送信 request_user: ${info.credentials.email}`);
            const information_room = await apply.getUserinformationRoomId(target_id);
            await messageController.add(`${info.user.name}さんからダイレクトメッセージの許可申請が届きました。`, info.user.id, information_room, socket);

        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }

        socket.emit('user:apply-resuest-has-sent', '許可申請を送りました。承認されるまでお待ち下さい。');
        logger.info(`6/6 ApplyController.apply() -> 処理完了 request_user: ${info.credentials.email}`);

    }
}

export default new ApplyController;