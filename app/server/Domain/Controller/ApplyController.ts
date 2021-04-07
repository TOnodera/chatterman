import loginManager from "../User/LoginManager";
import Exception from "../Exception/Exception";
import logger from "../Utility/logger";
import { UserBasicInfo } from "server/@types/types";
import apply from '../Apply/Apply';
import { Socket } from "socket.io";
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";

class ApplyController {

    async apply(target_id: string, info: UserBasicInfo, socket: Socket) {

        logger.info(`1/5 ApplyController.apply() -> 処理開始 target_id: ${target_id}, request_user: ${info.credentials.email}`);
        if (await loginManager.authenticate(info.credentials) == false) {
            throw new Exception("認証情報がない状態でDM申請を行ないました。不正な操作です。");
        }

        try {
            
            logger.info(`2/5 ApplyController.apply() -> target_idからの受信済みのDM申請がないか確認 request_user: ${info.credentials.email}`);
            if (await apply.hasAccepted(target_id, info.user.id)) {
                socket.emit('user:already-application-is-accepted','DM送信の申請を受信しています。詳しくはお知らせを確認して下さい。');
                return;
            }

            logger.info(`3/5 ApplyController.apply() -> target_idへの送信済みのリクエストがないか確認 request_user: ${info.credentials.email}`);
            if (await apply.hasAlreadyRequested(target_id, info.user.id)) {
                socket.emit('user:already-requested','申請を既に送信しています。許可されるのをお待ち下さい。');
                return;
            }

            logger.info(`4/5 ApplyController.apply() -> 申請メイン処理開始 request_user: ${info.credentials.email}`);
            await apply.apply(target_id, info.user.id);

        } catch (e) {
            SocketExceptionHandler.handle(e,socket);
        }

        socket.emit('user:apply-resuest-has-sent','許可申請を送りました。承認されるまでお待ち下さい。');
        if(/**　相手ユーザーがログインしていたらソケットにイベント通知する */ false){

        }
        logger.info(`6/5 ApplyController.apply() -> 処理完了 request_user: ${info.credentials.email}`);

    }
}

export default new ApplyController;