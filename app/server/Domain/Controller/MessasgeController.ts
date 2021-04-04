import Exception from "../Exception/Exception";
import Message from "../Message/Message";
import User from "../User/User";
import messages from '../Message/Messages';
import { Socket } from "socket.io";
import ExceptionHandler from "../Exception/ExceptionHandler";
import { SendMessageToClient } from "server/@types/types";

class MessageController{
    async add(strMessage:string,user_id: string,socket: Socket,room_id: string){
        const user: User = new User(user_id);
        if(await user.load()){
            
            const message: Message = new Message(strMessage,user,room_id);
            await message.add().catch(e=>{ExceptionHandler.handle(e,socket)});
            console.log("in message controller...",socket.rooms);
            
            const toClient: SendMessageToClient = {
                room_id: room_id,
                user_id: user_id,
                user_name: message.user?.name as string,
                message_id: message.message_id as string,
                message: strMessage,
                created_at: message.created_at?.get() as string
            };
            console.log(toClient);
            //ブロードキャスト
            socket.broadcast.to(room_id).emit('broadcast:user-send-message',toClient);
            //自分に送る
            socket.emit('broadcast:user-send-message',toClient);

            return;
        }
        throw new Exception('メッセージの登録に失敗しました。');
    }
    delete(): void{

    }
    edit(): void{

    }

    typing(user: {id:string,name:string},socket: Socket): void{
        socket.broadcast.emit('broadcast:user-typing',user);
    }

    async moreMessages(room_id: string,message_id: string,socket: Socket){
        const response: SendMessageToClient[] = await messages.more(room_id,message_id);
        for(let data of response){
            console.log(data.created_at);
        }
        socket.emit('user:send-messages-data',response);
    }

    async getLatest(room_id: string, sokcet: Socket){
        console.log(room_id);
        const response: SendMessageToClient[] = await messages.latest(room_id);
        sokcet.emit('user:send-latest-messages',response);
    }

}
export default new MessageController();