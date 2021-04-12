
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
    polymorphic_id: number
}

const PolymorphicTables = {
    requests: 'requests'
} as const;

const APPLY_REACTION = {
    IS_ACCEPT_UNTREATED: 0, //未処理
    IS_ACCEPT_ARROW: 1, //OK
    IS_ACCEPT_DENY: 2 //NO
} as const;
type ApplyReactionType = typeof APPLY_REACTION;

const APPLY_SENDER_NOTICE = {
    IS_NOTIFIED_YET: 1, //未送信
    IS_NOTIFIED_DONE: 2 //送信済
} as const;
type ApplySenderNoticeType = typeof APPLY_SENDER_NOTICE;