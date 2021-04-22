interface IMessage {
    registe(message: string, user_id: string, room_id: string, options?: MessageOptions): Promise<SendMessageToClient>;
    send(message: string, user_id: string, room_id: string, options?: MessageOptions): Promise<void>;
    get(message_id: string): Promise<IMessageEditor>;
}