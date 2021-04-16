/**
 * いまサーバー側とフロントで定義ファイル別れてるのでやり方調べて統一する
 */

interface Me {
    user: User;
    credentials: Credentials;
    isLogin: boolean;
    information_room: string;
}

interface User {
    id: string;
    name: string;
    isLogin?: boolean;
}

interface Credentials {
    email: string;
    password: string;
}

interface AfterLoginInfo {
    id: string;
    name: string;
    isLogin?: boolean;
    information_room: string;
}

interface UserRegisteInfo {
    name: string;
    credentials: Credentials;
}

interface Exception {
    message?: string;
    status?: number;
}

interface UserBasicInfo {
    user: User;
    credentials: Credentials;
}

interface FromServerMessage {
    room_id: string;
    user_id: string;
    user_name: string;
    message_id: string;
    message: string;
    created_at: string;
    options?: Options;
}

// メッセージに付いてくる可能性のある付加オプション
interface FromServerOptions {
    polimorphic_id: string | number;
}
