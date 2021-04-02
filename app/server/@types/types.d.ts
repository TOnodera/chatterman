
/**
 * クライアントから来る情報のdto
 **/

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
    message: string
}

interface NotifyLoggedIn{
    user: Client,
    credentials: Credentials,
    isLogin: boolean
}

interface Client{
    id: string,
    name: string
}