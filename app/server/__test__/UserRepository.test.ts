import User from '../Domain/User/User';
import UserRepository from '../Domain/User/UserRepository';
import { connector } from '../Domain/Utility/Connection';
import Exception from '../Domain/Exception/Exception';
import ExceptionHandler from '../Domain/Exception/ExceptionHandler';

describe('UserRepository', () => {

    let user: User;
    let email: string;
    let repository: UserRepository;
    /*
    const mockHandler = jest.fn();
    jest.mock('../Domain/Exception/ExceptionHandler', () => {
        return jest.fn().staticClass.mockImplementation(() => {
            return {
                handle: mockHandler
            }
        });
    });
    */

    beforeEach(async () => {
        await connector.query('TRUNCATE TABLE users');
        email = 'test@test.com';
        user = new User('test', { email: email, password: 'password' });
        repository = new UserRepository();
    });

    describe('registe()', () => {
        it('新規登録出来る', async () => {
            await user.registe();
            const getUser = await repository.getUserByEmail(email);
            expect(getUser && getUser.credentials.email).toBe(email);
        });

        it('例外はExceptionHandler.handleに渡す', async () => {
            connector.query = jest.fn(() => { throw new Exception('エラー', 500) });
            const spy = jest.spyOn(ExceptionHandler,'handle');
            await user.registe();
            expect(spy.mock.calls.length).toBe(1);
        });
    });


})