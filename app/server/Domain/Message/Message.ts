import uuid from "node-uuid";
import AuthenticationException from "../Exception/AuthenticationException";
import Exception from "../Exception/Exception";
import User from "../User/User";
import Datetime from "../Utility/Datetime";
import IMessageRepository from './IMessageRepository';
import MessageRepositoryFactory from './MessageRepositoryFactory';

class Message{

    private repository: IMessageRepository;
    message_id?: string;
    message?: string;
    user?: User;
    room_id?: string;
    created_at?: Datetime;
    
    constructor(message_id: string);
    constructor(message: string,user: User,room_id: string);
    constructor(message_or_id?: string,user?: User,room_id?: string){
        this.repository = MessageRepositoryFactory.create();
        if(user && room_id){
            this.message = message_or_id;
            this.user = user;
            this.room_id = room_id;
            return;
        }
        if(!user && !room_id && message_or_id){
            this.message_id = message_or_id;
            return;
        }        
        throw new Exception('コンストラクタの呼び出しが不正です。');
    }

    async add(): Promise<boolean>{
        if(!this.user || !this.room_id){
            throw new Exception('add()の呼び出し方法が間違っています。');
        }
        if(this.user.isAccessable(this.room_id) == false){
            throw new AuthenticationException('このトークルームには投稿できません。')
        }
        this.message_id = uuid.v4();
        return await this.repository.add(this);
    }

    async edit(newMessage:string): Promise<boolean>{
        if(await this.load() == false){
            throw new Exception('ロードに失敗しました。');
        }
        if(!this.message_id){
            throw new Exception('message_idがない状態でsave()は呼び出せません。');
        }
        console.log(this.user,this.room_id);
        if(!this.user || !this.room_id){
            throw new Exception('edit()の呼び出し方法が間違っています。');
        }
        if(await this.user.isEditable(this) == false){
            throw new AuthenticationException('このメッセージを編集できません。');
        }
        this.message = newMessage;
        return await this.repository.save(this);   
        
    }

    async delete(): Promise<boolean>{
        if(!this.message_id){
            throw new Exception('message_idがない状態でdelete()は呼び出せません。');
        }
        return await this.repository.delete(this.message_id);
    }

    async load(){
        if(this.message_id){
            const {message,exists} = await this.repository.get(this.message_id);
            if(exists){
                this.message = message?.message;
                this.room_id = message?.room_id;
                this.user = message?.user;
                this.created_at = message?.created_at;
                return true;
            }
        }
        return false;
    }

}
export default Message;