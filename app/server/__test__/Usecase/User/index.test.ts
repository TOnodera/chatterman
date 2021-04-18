import { query } from '../../../Domain/Utility/Connection/Connection';
import UserController from '../../../Domain/Controller/UserController';
import UserService from '../../../Domain/User/Service';

describe('User', () => {
    describe('registe()', () => {

        beforeEach(async () => {
            await query('TRUNCATE users;', []);
        });

        it.skip('ユーザー登録出来る', async () => {

            const fromClient: UserRegisteInfo = {

                name: 'test',
                credentials: {
                    email: 'test@test.com',
                    password: '12345'
                }
            };

            await UserController.registe(fromClient);
            expect(UserService.getUserByCredentials(fromClient.credentials)).toBe(fromClient.name);

        });
    });
});