import User from '../Domain/User/User';
import UserRepository from '../Domain/User/UserRepository';
import { connector } from '../Domain/Utility/Connection';
import Exception from '../Domain/Exception/Exception';
import ExceptionHandler from '../Domain/Exception/ExceptionHandler';

describe('UserRepository', () => {

    let user: User;
    let name: string;
    let email: string;
    let repository: UserRepository;
    let origin: any;
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
        name = 'tester';
        user = new User(name, { email: email, password: 'password' });
        repository = new UserRepository();
        origin = connector.query;;
    });

    afterEach(()=>{
        connector.query = origin;
        jest.clearAllMocks();
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

    describe('getUserByName()', () => {

        it('ユーザー名でUserインスタンスを取得出来る', async () => {
            await user.registe();
            const getUser = await repository.getUserByName(name);
            expect(getUser && getUser.name).toBe(name);
        });

        it('例外はExceptionHandler.handleに渡す', async () => {
            connector.query = jest.fn(() => { throw new Exception('エラー', 500) });
            const spy = jest.spyOn(ExceptionHandler,'handle');
            await user.registe();
            expect(spy.mock.calls.length).toBe(1);
        });

        
    });


})