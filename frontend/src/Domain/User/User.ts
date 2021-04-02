import socketStore from '../Socket';
import swal from '../../util/swal';

class UserDomain {

  me: Me;
  users: User[];
  handlers: {
    registerSuccessHandler: Function,
    loginSuccessHandler: Function,
    loginFailureHandler: Function,
    acceptUsersHandler: Function
  };

  constructor() {
    this.me = {
      user: {
        id: '',
        name: '',
      },
      credentials: {
        email: '',
        password: ''
      },
      isLogin: false
    };
    this.users = [];
    this.handlers = {
      registerSuccessHandler: Function,
      loginSuccessHandler: Function,
      loginFailureHandler: Function,
      acceptUsersHandler: Function
    };
    //リスナ起動
    this.registerSuccessListener();
    this.loginSuccessListener();
    this.loginFailureListener();
    this.acceptUsersListener();
  }

  isLogin() {
    return this.me.isLogin;
  }

  attemptLogin(credentials: Credentials){
    socketStore.socket.emit('user:attempt-login',credentials);
  }

  logout(credentials: Credentials){
    socketStore.socket.emit('user:logout',credentials);
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

  addRegisterSuccessHandler(func: Function) {
    this.handlers.registerSuccessHandler = func;
  }

  addLoginSuccessHandler(func: Function){
    this.handlers.loginSuccessHandler = func;
  }

  addLoginFailureHandler(func: Function){
    this.handlers.loginFailureHandler = func;
  }

  registerSuccessListener(){
    socketStore.socket.on('user:registered',(msg: string) => {
      this.handlers.registerSuccessHandler(msg);
    });
  }

  loginSuccessListener(){
    socketStore.socket.on('user:logged-in',(me: Me)=>{
      this.me = me;
      this.handlers.loginSuccessHandler();
    });
  }

  loginFailureListener(){
    socketStore.socket.on('user:login-failure',()=>{
      this.handlers.loginFailureHandler();
    });
  }

  acceptUsersListener(){
    socketStore.socket.on('user:send-users-data',(users: {id:string,name:string}[])=>{
      this.handlers.acceptUsersHandler(users);
    });
  }

  addAcceptUsersHandler(func: Function){
    this.handlers.acceptUsersHandler = func;
  }

  getUsersEvent(){
    socketStore.socket.emit('user:require-users');
  }

  
}

export default new UserDomain();