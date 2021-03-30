import Exception from "../Exception/Exception";
import Message from "../Message/Message";
import User from "../User/User";
import Messages from '../Message/Messages';
import { Socket } from "socket.io";
import ExceptionHandler from "../Exception/ExceptionHandler";

class MessageController{
    async add(strMessage:string,user_id: string,socket: Socket,room_id: string = 'everybody'){
        const user: User = new User(user_id);
        if(await user.load()){
            const message: Message = new Message(strMessage,user,room_id);
            await message.add().catch(e=>{ExceptionHandler.handle(e,socket)});
            return;
        }
        throw new Exception('メッセージの登録に失敗しました。');
    }
    delete(): void{

    }
    edit(): void{

    }
    async all(room_id: string): Promise<{messages?: Message[],exists: boolean}>{
        const {messages,exists} = await Messages.all(room_id);
        if(exists){
            return {messages: messages,exists: true};
        }
        return {exists: false};
    }
    typing(): void{
        
    }
}
export default new MessageController();