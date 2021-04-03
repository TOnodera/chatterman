import socketStore from '../Socket';
import swal from '../../util/swal';
import loginSubject from './Subject/LoginSubject';
import registerSubject from './Subject/RegisterSubject';
import acceptUsersSubject from './Subject/AcceptUsersSubject';
import logoutSubject from './Subject/LogoutSubject';
import anotherUserLoginSubject from './Subject/AnoterUserLoginSubject';

class UserDomain {

	me: Me;
	users: User[];

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

	attemptLogin(credentials: Credentials) {
		this.me.credentials = credentials;
		socketStore.socket.emit('user:attempt-login', credentials);
	}

	logout(id: string,credentials: Credentials) {
		socketStore.socket.emit('user:logout', id, credentials);
		this.me.isLogin = false;
	}

	getUsers() {
		socketStore.socket.emit('user:require-users');
	}

	registerSuccessListener() {
		socketStore.socket.on('user:registered', (msg: string) => {
			registerSubject.notify(msg);
		});
	}

	loginSuccessListener() {
		socketStore.socket.on('user:logged-in', (user: User) => {
			this.me.user = user;
			loginSubject.notify();
		});
	}

	acceptUsersListener() {
		socketStore.socket.on('user:send-users-data', (users: { id: string, name: string }[]) => {
			acceptUsersSubject.notify(users);
		});
	}

	logoutListener(){
		socketStore.socket.on('broadcast:user-logout',(id: string)=>{
			logoutSubject.notify(id);
		});
	}

	anotherUserLoginListener(){
		socketStore.socket.on('broadcast:user-login',(id:string)=>{
			anotherUserLoginSubject.notify(id);
		});
	}
}

export default new UserDomain();