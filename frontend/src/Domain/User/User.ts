import socketStore from '../Socket';
import swal from '../../util/swal';
import loginSubject from './Subject/LoginSubject';
import registerSubject from './Subject/RegisterSubject';
import acceptUsersSubject from './Subject/AcceptUsersSubject';

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
		socketStore.socket.emit('user:attempt-login', credentials);
	}

	logout(credentials: Credentials) {
		socketStore.socket.emit('user:logout', credentials);
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
		socketStore.socket.on('user:logged-in', (me: Me) => {
			this.me = me;
			loginSubject.notify();
		});
	}

	acceptUsersListener() {
		socketStore.socket.on('user:send-users-data', (users: { id: string, name: string }[]) => {
			acceptUsersSubject.notify(users);
		});
	}
}

export default new UserDomain();