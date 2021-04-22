import Message from "./Message";
import IMessageRegister from "./Interface/IMessageRegister";

class SystemMessage extends Message {
    async send(messageRegister: IMessageRegister, options?: MessageOptions) {
        const toClient = await super.registe(messageRegister, options);
        //システムメッセージはお知らせの想定なので個人宛のお知らせルームに送る
        this.messageEventEmitter.broadcastUserSendMessageEvent(messageRegister.room_id, toClient);
    }
}

export default SystemMessage;