import serverException from '@/Domain/Exception/ServerException';
import user from '@/Domain/User/User';

/**
 * サーバーから受信するイベントのリスナー
 * アプリ起動時とログイン後に起動するリスナを分けて設定している。
 */

const launchAtLoggedIn = ()=>{
    user.acceptUsersListener();
    user.logoutListener();
    user.anotherUserLoginListener();
};

const launchAtAppUped = ()=>{
    serverException.launchListener();
    user.loginSuccessListener();
};

export {
    launchAtLoggedIn,
    launchAtAppUped
};
