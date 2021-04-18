import IMessageRepository from './Repository/IMessageRepository';
import MessageEditor from './Message';
import MessageRepositoryFactory from './Factory/MessageRepositoryFactory';
import MessageFactory from './Factory/MessageFactory';
import Datetime from '../Utility/Datetime';
import messageService from './MessaseService';
import logger from '../Utility/logger';

class Messages {
    private repository: IMessageRepository;
    private nums: number = 20; //一度に取得するメッセージの件数

    constructor() {
        this.repository = MessageRepositoryFactory.create();
    }

    /**
     *
     * @param rows message_idの配列
     */
    async latest(room_id: string): Promise<SendMessageToClient[]> {
        const rows: any[] = await this.repository.latest(room_id, this.nums);
        if (rows.length > 0) {
            const messages: MessageEditor[] = [];
            for (let row of rows) {
                const message: MessageEditor = await MessageFactory.create(row.id);
                messages.push(message);
            }
            return messageService.toClient(messages);
        }
        return [];
    }

    /**
     *
     * @param room_id
     * @param message_id
     * room_idのmessage_idのcreated_atの日時より新しいメッセージを取得する
     * 想定される処理の流れ
     *  1.クライアントがスクロールイベントによってもっと前のメッセージを要求
     *  2.クライアントがルームの一番古いメッセージのIDを取得してサーバーに送信
     *  3.このメソッドがそのメッセージより古いメッセージを取得してクライアントに渡す    <-これやってる
     */
    async more(room_id: string, message_id: string): Promise<SendMessageToClient[]> {
        const created_at: Datetime = await messageService.getCreatedAt(message_id);
        const rows: any[] = await this.repository.more(room_id, created_at, this.nums);
        if (rows.length > 0) {
            const messages: MessageEditor[] = [];
            for (let row of rows) {
                const message: MessageEditor = await MessageFactory.create(row.id);
                messages.push(message);
            }
            return await messageService.toClient(messages);
        }
        return [];
    }
}

export default new Messages();
