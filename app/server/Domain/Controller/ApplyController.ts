import { Socket } from "socket.io";
import ApplyManager from "../Apply/ApplyManager";


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

    async reaction(unique_id: string,user_id: string,reaction: number){
        await this.applyManager.reaction(unique_id,user_id,reaction);
    }

}

export default ApplyController;