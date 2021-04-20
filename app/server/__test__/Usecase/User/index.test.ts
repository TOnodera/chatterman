import UserService from '../../../Domain/User/Service';
import UserEditor from '../../../Domain/User/UserEditor';
import UserRegister from '../../../Domain/User/UserRegister';
import User from '../../../Domain/User/User';
import { loginManager } from '../../../Domain/User/Login/LoginManager';
import { Socket } from 'socket.io';
const { launch, io } = require('../launch');
import { clientSocket } from '../client';

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

        it('HTTP,Socket両方ででログイン出来る', async (done) => {
            launch();
            expect(await loginManager.login(loginUser)).toBeTruthy();
            io.on('connection', (socket: Socket) => {
                console.log("connected...");
                socket.on("start", (message) => {
                    expect(message).toBe("start");
                    console.log(message);
                });
            });
            clientSocket.emit("start", "start");

        });


        afterAll(async () => {
            if (user_id) {
                await UserService.delete(user_id);
            }
        });

    });
});