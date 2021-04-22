import IMessageRegister from "./Interface/IMessageRegister";
import Message from "./Message";

class UserMessage extends Message {

    async send(messageRegister: IMessageRegister, options?: MessageOptions) {
        const toClient = await super.registe(messageRegister, options);
        //ルームにいるメンバーと自分自身に送る
        this.messageEventEmitter.broadcastUserSendMessageEvent(messageRegister.room_id, toClient);
        this.messageEventEmitter.sendUserSendMessageEvent(toClient);
    }
}

export default UserMessage;