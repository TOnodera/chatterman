
import logger from "../Domain/Utility/logger";
import { Socket } from "socket.io";
import ApplyController from '../Domain/Controller/ApplyController';

module.exports = (socket: Socket) => {

    const applyController = new ApplyController(socket);

    //ダイレクトメッセージの許可申請
    const applyDirectMessage = async (target_id: string, basicInfo: UserBasicInfo) => {
        applyController.apply(target_id, basicInfo);
    };

    //申請に対する処理（申請された側の処理受付）
    const applyReaction = async (unique_id: string, user_id: string, reaction: number) => {
        logger.debug(unique_id,user_id,reaction);
        await applyController.reaction(unique_id, user_id, reaction);
    }

    socket.on('user:apply-reaction', applyReaction);
    socket.on('user:apply-directmessage',applyDirectMessage);
    
};
