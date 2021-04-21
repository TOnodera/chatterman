import http from '../http';
import { query } from '../../../Utility/Connection/Connection';
import { launch, io, close } from '../../../launch';
import Client from 'socket.io-client';
import Config from '../../../Config';
import uuid from 'node-uuid';
import loginUserStore from '../../../Store/LoginUsersStore';

describe('User', () => {

    const credentials: Credentials = {
        "email": 'test@test.com',
        "password": "1234"
    };
    const loginUser = {
        name: uuid.v4(),
        credentials: credentials
    };
    const testBaseUrl = `http://localhost:${Config.system.test_port}`;

    let cookies: string = '';
    let beforeLoginSocketCount = 0;
    let socketIncrement = 0;

    beforeAll(() => {
        launch(Config.system.test_port);
    });

    afterAll(async () => {
        await query('DELETE FROM users WHERE id <> ?', [Config.system.superuser]);
        close();
    });


    describe('ユーザー登録とソケットログイン', () => {

        it('httpでユーザー登録出来る', async () => {

            const response = await http.post('/api/users', loginUser);
            expect(response.data.registered).toBe(true);

        });

        describe('httpでログイン後、socket側でもログイン出来る(Session情報受け渡し成功)', () => {

            beforeLoginSocketCount = loginUserStore.users.size;//ログイン前のソケットストアの数保管
            const clientSocket = Client(testBaseUrl, {
                withCredentials: true,
                extraHeaders: {
                    'Cookie': cookies
                }
            });

            it('ログイン開始', async () => {
                const response = await http.post('/api/login', credentials);
                expect(response.data.attempt).toBe(true);
                cookies = response.headers['set-cookie'][0];
            });


            it('ログイン完了', (done) => {
                clientSocket.emit('user:after-login', credentials);
                clientSocket.on('user:logged-in', (user: any) => {
                    expect(user.name).toBe(loginUser.name);
                    socketIncrement = loginUserStore.users.size - beforeLoginSocketCount;//ソケットの増分を取得
                    done();
                });
            });

            it('ログイン後ソケットストアにユーザー情報が格納される', () => {
                expect(loginUserStore.users.size).toBe(beforeLoginSocketCount + socketIncrement);
            });

            it('ログアウト処理が完了出来る', (done) => {
                clientSocket.emit('user:logout');
                clientSocket.on('disconnect', () => {
                    expect(loginUserStore.users.size).toBe(beforeLoginSocketCount);//元のサイズに戻るはず
                    done();
                });
            });

        });

    });
});