import socketStore from './socketStore';
import swal from '../util/swal';

export default {
  me: {} as Me,
  users: [] as User[],
  handlers: {
    registerExceptionHandler: (e: string) => {}
  },
  isLogin () {
    return this.me.isLogin;
  },
  addUser (user: User) {
    this.users.push(user);
  },
  deleteUser (id: string) {
    this.users = this.users.filter(user => {
      return user.id != id;
    });
  },
  userCount (): number {
    return this.users.length;
  },
  registe (newUser: UserRegisteInfo) {
    if (!newUser.name) {
      swal.fire('ユーザー名が未入力です。');
      return;
    }
    if (!newUser.credentials.email) {
      swal.fire('メールアドレスが未入力です。');
      return;
    }
    if (!newUser.credentials.password) {
      swal.fire('パスワードが未入力です。');
      return;
    }
    socketStore.socket.emit('user:registe', newUser);
  },
  addRegisterExceptionHandler (func: (e: string)=>{}) {
    this.handlers.registerExceptionHandler = func;
  },
  registerExceptionListener () {
    socketStore.socket.on('occurred:domain-exception', (msg: string) => {
      this.handlers.registerExceptionHandler(msg);
    });
  }
};
