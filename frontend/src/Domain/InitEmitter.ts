import user from './User/User';
import room from './Room/Room';
/**
 * アプリ起動時、ログイン時にフロント側から送信する必要があるイベントをこのファイルにまとめて書く
 */

 //起動時に送信するイベント
 const emitAtAppUped = () => {
    
 };

 //ログイン後に送信するイベント
 const emitAtLoggedIn = async () => {
    await user.getUsers();
    await room.getAllRooms(user.me.user.id);
 };

 export {
     emitAtAppUped,
     emitAtLoggedIn
 };