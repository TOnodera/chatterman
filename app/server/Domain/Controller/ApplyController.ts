import { APPLY_REACTION } from "server/Enum/Enum";
import { Socket } from "socket.io";
import ApplyManager from "../Apply/ApplyManager";
import logger from "../Utility/logger";


class ApplyController {

    /**
     * 申請処理はイベントが多いのでイベント送信もマネージャーに任せることにした
     */
    private applyManager: ApplyManager;

    constructor(socket: Socket) {
        this.applyManager = new ApplyManager(socket);
    }

    async apply(target_id: string, info: UserBasicInfo) {
        await this.applyManager.apply(target_id,info);        
    }

    async reaction(unique_id: number,user_id: string,reaction: APPLY_REACTION){
        await this.applyManager.reaction(unique_id,user_id,reaction);
    }

}

export default ApplyController;