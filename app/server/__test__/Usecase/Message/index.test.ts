import http from '../http';
import { query } from '../../../Utility/Connection/Connection';
import { launch, io, close } from '../../../launch';
import Client, { Socket } from 'socket.io-client';
import Config from '../../../Config';
import uuid from 'node-uuid';

describe('Message', () => {

    const credentials: Credentials = {
        "email": 'test@test.com',
        "password": "1234"
    };
    const loginUser = {
        name: uuid.v4(),
        credentials: JSON.parse(JSON.stringify(credentials))
    };
    const testBaseUrl = `http://localhost:${Config.system.test_port}`;

    let cookies: string = '';
    let clientSocket: Socket;
    let user_id: string;

    beforeAll(async () => {

        launch(Config.system.test_port);

        clientSocket = Client(testBaseUrl, {
            withCredentials: true,
            extraHeaders: {
                'Cookie': cookies
            }
        });

        await http.post('/api/users', loginUser);
        await http.post('/api/login', credentials);

    });

    afterAll(async () => {
        await query('DELETE FROM users WHERE id <> ?', [Config.system.systemuser]);
        await query('DELETE FROM messages', [Config.system.systemuser]);
        close();
    });

    it('ログイン完了', (done) => {
        clientSocket.emit('user:after-login', credentials);
        clientSocket.on('user:logged-in', (user: { id: string, name: string, isLogin?: boolean }) => {
            user_id = user.id;
            console.log(user_id);
            expect(user.name).toBe(loginUser.name);
            done();
        });
    });

    it('ミーティングルームにメッセージを送信', (done) => {
        clientSocket.emit('user:send-message', {
            message: "hello",
            user: {
                id: user_id,
                name: loginUser.name
            },
            room_id: 'everybody'
        });
        clientSocket.on('broadcast:user-send-message', (fromServer: any) => {
            expect(fromServer.room_id).toBe('everybody');
            expect(fromServer.user_id).toBe(user_id);
            done();
        })
    });

    it('入場が許可されていないルームにメッセージを送るとAuthenticationException例外発生', (done) => {
        clientSocket.emit('user:send-message', {
            message: "hello",
            user: {
                id: user_id,
                name: loginUser.name
            },
            room_id: 'inchiki-room'
        });
        clientSocket.on('occurred:authentication-exception', (message: string) => {
            expect(message).toBe('このトークルームには投稿できません。');
            done();
        })
    });

});