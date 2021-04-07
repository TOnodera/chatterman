import serverException from '@/Domain/Exception/ServerException';
import user from './User/User';
import room from './Room/Room';
import message from './Message/Message';
import apply from './Apply/Apply';

/**
 * サーバーから受信するイベントのリスナー
 * アプリ起動時とログイン後に起動するリスナを分けて設定している。
 */

const launchAtLoggedIn = ()=>{
    user.launchListener();
    room.launchListener();
    message.launchListener();
    apply.launchListener();
};

const launchAtAppUped = ()=>{
    serverException.launchListener();
    user.loginSuccessListener();
};

export {
    launchAtLoggedIn,
    launchAtAppUped
};
