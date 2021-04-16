import user from '../Domain/User/User';
import room from '../Domain/Room/Room';

/**
 * アプリ起動時、ログイン時にフロント側から送信する必要があるイベントをこのファイルにまとめて書く
 */

// 起動時に送信するイベント
const emitAtAppUped = () => {

};


// ログイン後に送信するイベント
const emitAtLoggedIn = () => {
  /**
   * イベント送信
   */
  // ユーザーデータ送信要求
  user.getMembers();
  // ルームデータ送信要求
  room.getRooms();
};

export {
  emitAtAppUped,
  emitAtLoggedIn
};
