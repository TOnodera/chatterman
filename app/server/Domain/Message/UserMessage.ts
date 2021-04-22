import Message from "./Message";

class UserMessage extends Message {

    async send(message: string, user_id: string, room_id: string, options?: MessageOptions) {
        const toClient = await super.registe(message, user_id, room_id, options);
        //ルームにいるメンバーと自分自身に送る
        this.messageEventEmitter.broadcastUserSendMessageEvent(room_id, toClient);
        this.messageEventEmitter.sendUserSendMessageEvent(toClient);
    }
}

export default UserMessage;