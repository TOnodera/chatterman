import { query } from '../../../Utility/Connection/Connection';
import UserService from '../../../Domain/User/Service';
import UserEditor from '../../../Domain/User/UserEditor';
import UserRegister from '../../../Domain/User/UserRegister';
import User from '../../../Domain/User/User';
import { loginManager } from '../../../Domain/User/Login/LoginManager';
//@ts-ignore
import MockedSocket from 'socket.io-mock';

describe('User', () => {
    describe('登録、ログイン', () => {

        const loginUser: Credentials = {
            "email": 'test@test.com',
            "password": "1234"
        }

        let user_id: string | null = null;

        it('ユーザー登録出来る', async () => {

            const fromClient: UserRegisteInfo = {
                name: 'test',
                credentials: {
                    email: 'test@test.com',
                    password: '1234'
                }
            };

            const userRegister: IUserRegister = new UserRegister(fromClient.name, fromClient.credentials);
            user_id = await User.registe(userRegister);
            const user: UserEditor = await UserService.getUserByCredentials(loginUser);
            expect(user.credentials.email).toBe(fromClient.credentials.email);
        });

        it('ログイン出来る', async () => {
            expect(await loginManager.login(loginUser)).toBeTruthy();
        });

        it('ソケット側でも認証できる', async () => {
            expect(await loginManager.getAfterLoginManager(MockedSocket).authenticate(loginUser)).toBeTruthy();
        });

        afterAll(async () => {
            if (user_id) {
                await UserService.delete(user_id);
            }
        });

    });
});