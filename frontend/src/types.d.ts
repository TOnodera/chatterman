interface Me{
    user: User,
    credentials: Credentials,
    isLogin: boolean,
    information_room: string
}

interface User{
    id: string,
    name: string,
    isLogin?: boolean
}

interface Credentials{
    email: string,
    password: string
}

interface AfterLoginInfo{
    id: string,
    name: string,
    isLogin?: boolean,
    information_room: string
}


interface UserRegisteInfo {
    name: string,
    credentials: Credentials
}

interface Exception{
    message?: string,
    status?: number
}

interface UserBasicInfo{
    user: User,
    credentials: Credentials 
}

interface FromServerMessage{
    room_id: string,
    user_id: string,
    user_name: string,
    message_id: string,
    approve_option?: ApproveOptions,//認証メッセージの場合は付いてくる
    message: string,
    created_at: string
}

//メッセージに付いてくる可能性のある付加オプション
interface MessageOptions{
    polimorphic_table: string,
    polimorphic_id: string | number
}

interface ApproveOptions extends MessageOptions{
    user_id: string
}