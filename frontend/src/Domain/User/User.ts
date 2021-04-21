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
				name: ''
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

	isLogin(): boolean {
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

		const response = await http.post('/api/users', newUser);
		if (error.hasHttpError(response.data)) {
			error.showError(response.data);
			return false;
		}
		return true;
	}

	async attemptLogin(credentials: Credentials) {
		this.me.credentials = credentials;

		const response = await http.post('/api/login', credentials);
		const data: any = response.data;

		if (error.hasHttpError(data)) {
			socketStore.socket.close();
			error.showError(data);
			return;
		}

		// コネクション確立されるまで待つ
		if (await socketStore.start()) {
			// ログイン完了イベント発行
			socketStore.socket.emit('user:after-login', credentials);
		}
	}

	logout() {
		//socketStore.socket.disconnect();
		socketStore.socket.emit('user:logout');
		this.me.isLogin = false;
	}

	getMembers() {
		socketStore.socket.emit('user:require-members');
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
		socketStore.registeOnce('room:send-directmessage-members-data',
			(users: { id: string, name: string, room_id?: string, isLogin?: boolean }[]) => {
				acceptUsersSubject.notify(users);
			});
	}

	memberInfoUpdateListener() {
		socketStore.registeOnce('room:data-update', () => {
			// 更新情報受信したらデーター送信要求
			this.getMembers();
		});
	}

	logoutListener() {
		socketStore.registeOnce('broadcast:user-logout', (id: string) => {
			logoutSubject.notify(id);
		});
	}

	anotherUserLoginListener() {
		socketStore.registeOnce('broadcast:user-login', (id: string) => {
			anotherUserLoginSubject.notify(id);
		});
	}

	launchListener() {
		this.acceptUsersListener();
		this.logoutListener();
		this.anotherUserLoginListener();
		this.memberInfoUpdateListener();
	}
}

export default new UserDomain();
