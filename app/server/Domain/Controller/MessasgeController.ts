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
            /*
            const res = socket.to(room_id).emit('broadcast:user-send-message',{
                room_id: room_id,
                user_id: user_id,
                message: strMessage
            });
            */
            socket.emit('broadcast:user-send-message',{
                room_id: room_id,
                user_id: user_id,
                user_name: message.user!.name,
                message_id: message.message_id,
                message: strMessage
            });
            console.log('emitted...');
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
    typing(socket: Socket): void{
        socket.on('user:typing',(user: {id:string,name:string})=>{
            socket.broadcast.emit('broadcast:user-typing',user);
        });
    }
}
export default new MessageController();