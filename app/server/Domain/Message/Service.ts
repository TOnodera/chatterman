import MessageEditor from './MessageEditor';;
class Service {
    /**
     *
     * @param messages
     * メッセージオブジェクトにはUserオブジェクトが含まれていてbroadcast配信する必要のないデータがある。
     * 送信に必要なデータだけここでピックアップして送る。
     */
    toClient(messages: MessageEditor[]): SendMessageToClient[] {
        let toClient: SendMessageToClient[] = [];
        for (let message of messages) {
            const client: SendMessageToClient = {
                room_id: message.room_id,
                user_id: message.user.id,
                user_name: message.user.name,
                message_id: message.message_id,
                message: message.message,
                created_at: message.created_at.get(),
                options: message.options
            };
            toClient.push(client);
        }
        return toClient;
    }
}
export default new Service;
