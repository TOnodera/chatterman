import socketStore from '../Socket';
import swal from '../../util/swal';
import loginSubject from './Subject/LoginSubject';
import acceptUsersSubject from './Subject/AcceptUsersSubject';
import logoutSubject from './Subject/LogoutSubject';
import anotherUserLoginSubject from './Subject/AnoterUserLoginSubject';
import http from '@/util/axios';
import error from '@/util/HttpError';

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
			isLogin: false,
			information_room: ''
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

	async registe(newUser: UserRegisteInfo): Promise<boolean> {
		if (!newUser.name) {
			swal.warning('ユーザー名が未入力です。');
			return false;
		}
		if (!newUser.credentials.email) {
			swal.warning('メールアドレスが未入力です。');
			return false;
		}
		if (!newUser.credentials.password) {
			swal.warning('パスワードが未入力です。');
			return false;
		}

		const response = await http.post('/api/users',newUser);
		if(error.hasHttpError(response.data)){
			error.showError(response.data);
			return false;
		}
		return true;
	}

	async attemptLogin(credentials: Credentials) {

		this.me.credentials = credentials;
		const response = await http.post('/api/login',credentials);
		const data: any = response.data;

		if(error.hasHttpError(data)){
			error.showError(data);
			return;
		}

		//ログイン完了イベント発行
		socketStore.socket.emit('user:after-login',credentials);
		
	}

	logout(id: string,credentials: Credentials) {
		socketStore.socket.emit('user:logout', id, credentials);
		this.me.isLogin = false;
	}

	getMembers(user_id: string) {
		socketStore.socket.emit('user:require-members',user_id);
	}

	loginSuccessListener() {
		socketStore.registeOnce('user:logged-in', (user: AfterLoginInfo) => {
			this.me.user = user;
			this.me.isLogin = true;
			this.me.information_room = user.information_room;
			loginSubject.notify();
		});
	}

	acceptUsersListener() {
		socketStore.registeOnce('user:send-members-data', (users: { id: string, name: string }[]) => {
			acceptUsersSubject.notify(users);
		});
	}

	logoutListener(){
		socketStore.registeOnce('broadcast:user-logout',(id: string)=>{
			logoutSubject.notify(id);
		});
	}

	anotherUserLoginListener(){
		socketStore.registeOnce('broadcast:user-login',(id:string)=>{
			anotherUserLoginSubject.notify(id);
		});
	}

	launchListener(){
		this.acceptUsersListener();
		this.logoutListener();
		this.anotherUserLoginListener();
	}
}

export default new UserDomain();