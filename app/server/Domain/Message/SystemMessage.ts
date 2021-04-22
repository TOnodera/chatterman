import Message from "./Message";
import Config from "../../Config";

class SystemMessage extends Message {
    async send(message: string, user_id: string, room_id: string, options?: MessageOptions) {
        const toClient = await super.registe(message, user_id, room_id, options);
        //システムメッセージはお知らせの想定なので個人宛のお知らせルームに送る
        this.messageEventEmitter.broadcastUserSendMessageEvent(room_id, toClient);
    }
}

export default SystemMessage;