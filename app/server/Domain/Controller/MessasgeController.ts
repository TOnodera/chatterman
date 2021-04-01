import Exception from "../Exception/Exception";
import Message from "../Message/Message";
import User from "../User/User";
import Messages from '../Message/Messages';
import { Socket } from "socket.io";
import ExceptionHandler from "../Exception/ExceptionHandler";

class MessageController{
    async add(strMessage:string,user_id: string,socket: Socket,room_id: string){
        const user: User = new User(user_id);
        if(await user.load()){
            const message: Message = new Message(strMessage,user,room_id);
            await message.add().catch(e=>{ExceptionHandler.handle(e,socket)});
            console.log("in message controller...",socket.rooms);
            
            //Room系のクラスで実装しなおした　要リファクタリング
            socket.broadcast.to(room_id).emit('broadcast:user-send-message',{
                room_id: room_id,
                user_id: user_id,
                user_name: message.user!.name,
                message_id: message.message_id,
                message: strMessage
            });
            //自分に送る
            socket.emit('broadcast:user-send-message',{
                room_id: room_id,
                user_id: user_id,
                user_name: message.user!.name,
                message_id: message.message_id,
                message: strMessage
            });
            //END Room系のクラスで実装しなおした　要リファクタリング

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
    typing(user: {id:string,name:string},socket: Socket): void{
        socket.broadcast.emit('broadcast:user-typing',user);
    }
}
export default new MessageController();