import User from '../Domain/User/User';
import { mySqlConnector } from '../Domain/Utility/Connection';
import Exception from '../Domain/Exception/Exception';
import ExceptionHandler from '../Domain/Exception/ExceptionHandler';
import IUserRepository from '../Domain/User/IUserRepository';
import UserRepositoryFactory from '../Domain/User/UserRepositoryFactory';

describe('UserRepository', () => {

    let user: User;
    let name: string;
    let email: string;
    let password: string;
    let repository: IUserRepository;
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
        await mySqlConnector.query('TRUNCATE TABLE users');
        email = 'test@test.com';
        name = 'tester';
        password = 'password';
        user = new User(name, { email: email, password: password });
        repository = UserRepositoryFactory.create();
        origin = mySqlConnector.query;;
    });

    afterEach(()=>{
        mySqlConnector.query = origin;
        jest.clearAllMocks();
    });

    describe('registe()', () => {

        it('新規登録出来る', async () => {
            await user.registe();
            const getUser = await repository.getUserByEmail(email);
            expect(getUser && getUser.credentials.email).toBe(email);
        });

        it('例外はExceptionHandler.handleに渡す', async () => {
            mySqlConnector.query = jest.fn(() => { throw new Exception('エラー', 500) });
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
            mySqlConnector.query = jest.fn(() => { throw new Exception('エラー', 500) });
            const spy = jest.spyOn(ExceptionHandler,'handle');
            await repository.getUserByName(name);
            expect(spy.mock.calls.length).toBe(1);
        });
 
    });

    describe('getUserByCredentials()', () => {

        it('email,passwordでユーザーインスタンスを取得出来る', async () => {
            await user.registe();
            const getUser = await repository.getUserByCredentials({email: email,password: password});
            expect(getUser && getUser.credentials.email).toBe(email);
        });

        it('例外はExceptionHandler.handleに渡す', async () => {
            mySqlConnector.query = jest.fn(() => { throw new Exception('エラー', 500) });
            const spy = jest.spyOn(ExceptionHandler,'handle');
            await repository.getUserByCredentials({email: email , password: password});
            expect(spy.mock.calls.length).toBe(1);
        });
 
    });


})