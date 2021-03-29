import socketStore from './ClientStore';
import swal from '../util/swal';

class UserDomain {

  me: Me;
  users: User[];
  handlers: {
    registerExceptionHandler: Function,
    registerSuccessHandler: Function,
    loginSuccessHandler: Function
  };

  constructor() {
    this.me = {} as Me;
    this.users = [];
    this.handlers = {
      registerExceptionHandler: () => { },
      registerSuccessHandler: () => { },
      loginSuccessHandler: ()=> {}
    };
    //リスナ登録
    this.registerExceptionListener();
    this.registerSuccessListener();
    this.loginSuccessListener();
  }

  isLogin() {
    return this.me.isLogin;
  }

  attemptLogin(credentials: Credentials){
    socketStore.socket.emit('user:attempt-login',credentials);
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

  addLoginSuccessHandler(func: Function){
    this.handlers.loginSuccessHandler = func;
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

  loginSuccessListener(){
    socketStore.socket.on('user:logged-in',()=>{
      this.handlers.loginSuccessHandler();
    });
  }

}

export default new UserDomain();