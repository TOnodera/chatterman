import Exception from "../Exception/Exception";
import Message from "../Message/Message";
import User from "../User/User";

class MessageController{
    async add(strMessage:string,user_id: string,room_id: string = 'everybody'){
        const user: User = new User(user_id);
        if(await user.load()){
            const message: Message = new Message(strMessage,user,room_id);
            message.add();
        }
        throw new Exception('メッセージの登録に失敗しました。');
    }
    delete(): void{

    }
    edit(): void{

    }
    all(room_id: string): Message[]{

    }
    typing(): void{

    }
}
export default MessageController;