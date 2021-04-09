import { SendMessageToClient } from 'server/@types/types';
import IMessageRepository from './Repository/IMessageRepository';
import Message from './Message';
import MessageRepositoryFactory from './Factory/MessageRepositoryFactory';

class Messages{

    private repository : IMessageRepository;
    private nums: number = 20;//一度に取得するメッセージの件数

    constructor(){
        this.repository = MessageRepositoryFactory.create();
    }

    async latest(room_id: string): Promise<SendMessageToClient[]> {
        const result = await this.repository.latest(room_id,this.nums);
        return this.toClient(result); 
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
    async more(room_id: string,message_id: string): Promise<SendMessageToClient[]> {
        const result = await this.repository.more(room_id,message_id,this.nums);
        return await this.toClient(result);
    }

    /**
     * 
     * @param messages 
     * メッセージオブジェクトにはUserオブジェクトが含まれていてbroadcast配信する必要のないデータがある。
     * 送信に必要なデータだけここでピックアップして送る。
     */
    toClient(messages: Message[]): SendMessageToClient[]{
        let toClient: SendMessageToClient[] = [];
        for(let message of messages){
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

export default new Messages();