import uuid from "node-uuid";
import AuthenticationException from "../Exception/AuthenticationException";
import Exception from "../Exception/Exception";
import User from "../User/User";
import IMessageRepository from './IMessageRepository';
import MessageRepositoryFactory from './MessageRepositoryFactory';

class MessageRegister{

    private repository: IMessageRepository;
    message_id: string;
    message: string;
    user: User;
    room_id: string;
    
    constructor(message: string,user: User,room_id: string){
        this.repository = MessageRepositoryFactory.create();
        this.message_id = uuid.v4();
        this.message = message;
        this.user = user;
        this.room_id = room_id;        
    }

    async add(): Promise<string>{
        if(await this.user.isAccessable(this.room_id) == false){
            throw new AuthenticationException('このトークルームには投稿できません。')
        }
        this.message_id = uuid.v4();
        if(await this.repository.add(this)){
            return this.message_id;
        }
        throw new Exception('メッセージの登録に失敗しました。');
    }
}
export default MessageRegister;