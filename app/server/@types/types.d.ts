
/**
 * クライアントから来る情報のdto
 **/

import User from "server/Domain/User/User";
import Datetime from "server/Domain/Utility/Datetime";

interface UserRegisteInfo {
    name: string,
    credentials: Credentials
}

interface RoomAndUserId{
    room_id: string,
    user_id: string
}

interface UserBasicInfo{
    user: {
        id: string,
        name: string
    },
    credentials: Credentials
}

/**
 * クライアントに送る情報
 */

interface SendMessageToClient{
    room_id: string,
    user_id: string,
    user_name: string,
    message_id: string,
    approve_option?: ApproveOptions,
    message: string,
    created_at: string
}

//メッセージの付加オプション
interface MessageOptions{
    polimorphic_table: string,
    polimorphic_id: string | number
}

interface ApproveOptions extends MessageOptions{
    user_id: string
}


interface Client{
    id: string,
    name: string,
    room_id?: string,
    isLogin?: boolean
}

interface AfterLoginInfo{
    id: string,
    name: string,
    information_room: string
}

interface RoomInfo{
    id: string,
    name: string
}

interface RoomType{
    Type: 'talkroom' | 'directmessage' | 'information' 
}
