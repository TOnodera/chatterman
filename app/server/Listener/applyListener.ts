import { APPLY_REACTION } from '../Enum/Enum';
import { Socket } from 'socket.io';
import ApplyController from '../Domain/Controller/ApplyController';
import socketService from '../Domain/Utility/SocketService';

module.exports = (socket: Socket) => {
    const applyController = new ApplyController(socket);

    //ダイレクトメッセージの許可申請
    const applyDirectMessage = async (target_id: string, basicInfo: UserBasicInfo) => {
        applyController.apply(target_id, basicInfo);
    };

    //申請に対する処理（申請された側の処理受付）
    const applyReaction = async (unique_id: number, user_id: string, reaction: APPLY_REACTION) => {
        await applyController.reaction(unique_id, user_id, reaction);
    };

    socketService.registeOnce('user:apply-reaction', applyReaction, socket);
    socketService.registeOnce('user:apply-directmessage', applyDirectMessage, socket);
};
