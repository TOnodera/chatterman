
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
    id: string,
    user: UserRegisteInfo
}

/**
 * クライアントに送る情報のdto
 */

interface SendMessageToClient{
    room_id: string,
    user_id: string,
    user_name: string,
    message_id: string,
    message: string,
    created_at: string
}

interface Client{
    id: string,
    name: string,
    room_id?: string,
    isLogin?: boolean
}

interface RoomInfo{
    id: string,
    name: string
}

interface RoomType{
    Type: 'talkroom' | 'directmessage'
}

/**
 * その他
 */

interface MessageDto{
    message_id: string,
    message: string,
    user: User,
    room_id: string,
    created_at: Datetime
};