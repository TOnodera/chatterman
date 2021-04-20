import { query } from '../../../Utility/Connection/Connection';
import UserController from '../../../Controller/UserController';
import UserService from '../../../Domain/User/Service';
import UserEditor from 'server/Domain/User/UserEditor';

describe('User', () => {
    describe('registe()', () => {

        it('ユーザー登録出来る', async () => {

            const fromClient: UserRegisteInfo = {

                name: 'test',
                credentials: {
                    email: 'test@test.com',
                    password: '12345'
                }

            };

            await UserController.registe(fromClient);
            //const user: UserEditor = await UserService.getUserByCredentials(fromClient.credentials);
            //expect(user.name).toBe(fromClient.name);


        });
    });
});