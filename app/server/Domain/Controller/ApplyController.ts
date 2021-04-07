import User from "../User/User";
import loginManager from "../User/LoginManager";
import Exception from "../Exception/Exception";
import logger from "../Utility/logger";
import { UserBasicInfo } from "server/@types/types";
import apply from '../Apply/Apply';
import { Socket } from "socket.io";
import { userInfo } from "os";
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";

class ApplyController {

    async apply(target_id: string, info: UserBasicInfo, socket: Socket) {

        logger.info(`1/5 ApplyController.apply() -> 処理開始 target_id: ${target_id}, request_user: ${info.user.credentials.email}`);
        if (await loginManager.authenticate(info.user.credentials) == false) {
            throw new Exception("認証情報がない状態でDM申請を行ないました。不正な操作です。");
        }

        try {
            
            logger.info(`2/5 ApplyController.apply() -> target_idからの受信済みのDM申請がないか確認 request_user: ${info.user.credentials.email}`);
            if (apply.hasAccepted(target_id, info.id)) {
                socket.emit('user:already-application-is-accepted');
            }

            logger.info(`3/5 ApplyController.apply() -> target_idへの送信済みのリクエストがないか確認 request_user: ${info.user.credentials.email}`);
            if (apply.hasAlreadyRequested(target_id, info.id)) {
                socket.emit('user:already-requested');
            }

            logger.info(`4/5 ApplyController.apply() -> 申請メイン処理開始 request_user: ${info.user.credentials.email}`);
            apply.apply(target_id, info.id);

        } catch (e) {
            SocketExceptionHandler.handle(e,socket);
        }

        logger.info(`6/5 ApplyController.apply() -> 処理完了 request_user: ${info.user.credentials.email}`);

    }
}

export default new ApplyController;