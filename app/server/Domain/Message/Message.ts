import { transaction } from "../../Utility/Connection/Connection";
import MessageRegister from "./MessageRegister";
import PolymorphicManager from '../Polymorphic/PolymorphicManager';
import Exception from "../../Exception/Exception";
import MessageFactory from './Factory/MessageFactory';
import MessageService from './Service';
import MessageEventEmitter from "./MessageEventEmitter";
import { Socket } from "socket.io";
import IMessageRepository from "./Interface/IMessageRepository";
import MessageRepositoryFactory from "./Factory/MessageRepositoryFactory";
import Datetime from "../../Utility/Datetime";
import IMessageEditor from "./Interface/IMessageEditor";
import IMessageRegister from "./Interface/IMessageRegister";

abstract class Message {

    protected messageEventEmitter: MessageEventEmitter;
    protected repository: IMessageRepository;
    protected MAX_MESSAGES_COUNT = 20;// メッセージの送信要求をクライアントから受けた際に返すメッセージの最大数

    constructor(socket: Socket) {
        this.messageEventEmitter = new MessageEventEmitter(socket);
        this.repository = MessageRepositoryFactory.create();
    }

    /**
     * 
     * @param message 
     * @param user_id 
     * @param room_id 
     * @param options 
     * メッセージを登録。オプションがあれば関連テーブルにまとめて登録(このメソッドが登録の実態)
     */
    protected async registe(messageRegister: IMessageRegister, options?: MessageOptions): Promise<SendMessageToClient> {
        const [toClient]: SendMessageToClient[] = await transaction(
            async (): Promise<SendMessageToClient[]> => {

                const message_id = await messageRegister.registe();

                if (options) {
                    //ポリモーフィック関連テーブルに登録する
                    if (await PolymorphicManager.save(message_id, options) == false) {
                        throw new Exception("ポリモーフィック関連テーブルの登録処理に失敗しました。");
                    }
                }

                //データ取得して返す
                const registeredNow: IMessageEditor = await this.get(message_id);
                const toClient: SendMessageToClient[] = await MessageService.toClient([registeredNow]);

                return toClient;
            });
        return toClient;
    }


    /**
     * 
     * @param message 
     * @param user_id 
     * @param room_id 
     * @param options 
     * 抽象メソッド　送信は方法は小クラスに任せる
     */
    abstract send(messageRegister: MessageRegister, options?: MessageOptions): Promise<void>;


    async get(message_id: string): Promise<IMessageEditor> {
        const message: IMessageEditor = await MessageFactory.create(message_id);
        return message;
    }

    delete(): void { }

    edit(): void { }

    /**
     * 
     * @param user 入力中のユーザー
     * @param room_id 入力しているルーム
     */
    typing(user: { id: string; name: string }, room_id: string): void {
        this.messageEventEmitter.broadcastUserTypingEvent(user.name, room_id);
    }

    /**
     *
     * @param rows message_idの配列
     */
    async latest(room_id: string): Promise<void> {
        const rows: any[] = await this.repository.latest(room_id, this.MAX_MESSAGES_COUNT);
        if (rows.length > 0) {
            const messages: IMessageEditor[] = [];
            for (let row of rows) {
                const message: IMessageEditor = await MessageFactory.create(row.id);
                messages.push(message);
            }
            const toClientMessages: SendMessageToClient[] = MessageService.toClient(messages);
            if (toClientMessages.length > 0) {
                //ルームにメッセージがあればデータを付けてイベント発行
                this.messageEventEmitter.sendSendMessagesDataEvent(toClientMessages);
            }
        }
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
    async more(room_id: string, message_id: string): Promise<void> {
        const message: IMessageEditor = await this.get(message_id);
        const created_at: Datetime = message.created_at;
        const rows: any[] = await this.repository.more(room_id, created_at, this.MAX_MESSAGES_COUNT);
        if (rows.length > 0) {
            const messages: IMessageEditor[] = [];
            for (let row of rows) {
                const message: IMessageEditor = await MessageFactory.create(row.id);
                messages.push(message);
            }
            const toClientMessages: SendMessageToClient[] = MessageService.toClient(messages);
            if (toClientMessages.length > 0) {
                this.messageEventEmitter.sendSendLatestMessagesEvent(toClientMessages);
            }
        }
    }

}
export default Message;