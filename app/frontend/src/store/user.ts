import socketStore from './socketStore';
import swal from '../util/swal';

class UserDomain {

  me: Me;
  users: User[];
  handlers: {
    registerExceptionHandler: Function,
    registerSuccessHandler: Function
  };

  constructor() {
    this.me = {} as Me;
    this.users = [];
    this.handlers = {
      registerExceptionHandler: () => { },
      registerSuccessHandler: () => { }
    };
    //リスナ登録
    this.registerExceptionListener();
    this.registerSuccessListener();
  }

  isLogin() {
    return this.me.isLogin;
  }

  addUser(user: User) {
    this.users.push(user);
  }

  deleteUser(id: string) {
    this.users = this.users.filter(user => {
      return user.id != id;
    });
  }

  userCount(): number {
    return this.users.length;
  }

  registe(newUser: UserRegisteInfo): boolean {
    if (!newUser.name) {
      swal.fire('ユーザー名が未入力です。');
      return false;
    }
    if (!newUser.credentials.email) {
      swal.fire('メールアドレスが未入力です。');
      return false;
    }
    if (!newUser.credentials.password) {
      swal.fire('パスワードが未入力です。');
      return false;
    }
    socketStore.socket.emit('user:register', newUser);
    return true;
  }

  addRegisterExceptionHandler(func: Function) {
    this.handlers.registerExceptionHandler = func;
  }

  addRegisterSuccessHandler(func: Function) {
    this.handlers.registerSuccessHandler = func;
  }

  registerExceptionListener() {
    socketStore.socket.on('occurred:domain-exception', (msg: string) => {
      this.handlers.registerExceptionHandler(msg);
    });
  }

  registerSuccessListener(){
    socketStore.socket.on('user:registered',(msg: string) => {
      this.handlers.registerSuccessHandler(msg);
    });
  }

}

export default new UserDomain();