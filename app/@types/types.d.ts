
/**
 * クライアントから来る情報のdto
 **/

interface UserRegisteInfo {
    name: string,
    credentials: Credentials
}

interface RoomAndUserId {
    room_id: string,
    user_id: string
}

interface UserBasicInfo {
    user: {
        id: string,
        name: string
    },
    credentials: Credentials
}

/**
 * クライアントに送る情報
 */

interface SendMessageToClient {
    room_id: string,
    user_id: string,
    user_name: string,
    message_id: string,
    options?: Options,
    message: string,
    created_at: string
}

interface Client {
    id: string,
    name: string,
    room_id?: string,
    isLogin?: boolean
}

interface AfterLoginInfo {
    id: string,
    name: string,
    information_room: string
}

interface RoomInfo {
    room_id: string,
    name: string
}

interface Options {
    unique_id: number
}

interface ApproveOptions extends Options {
    user_id: string
}


interface PolymorphicInfo {
    polymorphic_table: 'requests',//ポリモーフィック関連でテーブル名を受け付けるので設定されている以外の値が代入されないようにする
    polymorphic_id: number
}

//データ登録時に使用
//メッセージの付加オプション
interface MessageOptions extends PolymorphicInfo {
}


