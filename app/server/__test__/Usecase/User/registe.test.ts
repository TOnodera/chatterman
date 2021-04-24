import UserService from '../../../Domain/User/Service';
import User from '../../../Domain/User/User';
import UserRegister from '../../../Domain/User/UserRegister';
import UserManager from '../../../Domain/User/UserManager';
import { loginManager } from '../../../Domain/User/Login/LoginManager';
import { Socket } from 'socket.io';
import http from '../http';

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
            user_id = await UserManager.registe(userRegister);
            const user: User = await UserService.getUserByCredentials(loginUser);
            expect(user.credentials.email).toBe(fromClient.credentials.email);

        });

        afterAll(async () => {
            if (user_id) {
                await UserService.delete(user_id);
            }
        });

    });
});