
/**
 * クライアントから来る情報のdto
 **/

import Datetime from "server/Domain/Utility/Datetime";

interface UserRegisteInfo {
    name: string,
    credentials: Credentials
}

interface RoomAndUserId{
    room_id: string,
    user_id: string
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
    isLogin?: boolean
}

interface RoomInfo{
    id: string,
    name: string
}