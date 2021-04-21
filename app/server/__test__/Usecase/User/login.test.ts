import http from '../http';
import { query } from '../../../Utility/Connection/Connection';
import { launch, io, close } from '../../../launch';
import Client from 'socket.io-client';
import Config from '../../../Config';

describe('User', () => {

    const credentials: Credentials = {
        "email": 'test@test.com',
        "password": "1234"
    };
    const loginUser = {
        name: 'test',
        credentials: credentials
    };
    const testBaseUrl = `http://localhost:${Config.system.test_port}`;
    let cookies: string = '';

    beforeAll(() => {
        launch(Config.system.test_port);
    });

    afterAll(async () => {
        await query('DELETE FROM users WHERE id <> "system-chatter"', []);
        close();
    });


    describe('ユーザー登録とソケットログイン', () => {

        it('httpでユーザー登録出来る', async () => {

            const response = await http.post('/api/users', loginUser);
            expect(response.data.registered).toBe(true);

        });

        it('httpでログイン後、socket側でもログイン出来る(Session情報受け渡し成功)', async (done) => {

            const response = await http.post('/api/login', credentials);
            expect(response.data.attempt).toBe(true);
            cookies = response.headers['set-cookie'][0];

            const clientSocket = Client(testBaseUrl, {
                withCredentials: true,
                extraHeaders: {
                    'Cookie': cookies
                }
            });

            clientSocket.on('connect', done);

        });

    });
});