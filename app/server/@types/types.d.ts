
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
    options?: Options,
    message: string,
    created_at: string
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

interface Options{
    unique_id: string
}

interface ApproveOptions extends Options{
    user_id: string
}

//データ登録時に使用
//メッセージの付加オプション
interface MessageOptions{
    polymorphic_table: 'requests',//ポリモーフィック関連でテーブル名を受け付けるので設定されている以外の値が代入されないようにする
    polymorphic_id: string | number
}