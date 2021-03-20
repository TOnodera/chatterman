import IUserRepository from 'server/Domain/User/IUserRepository';
import UserRepository from 'server/Domain/User/UserRepository';
import { ReadConfig } from '../Domain/ReadConfig';

describe('サーバーサイドのテスト',()=>{

    describe('ReadConfigクラス',()=>{
        it('設定を読み取れる',()=>{
            expect(ReadConfig.dabtabaseConfig().test.host).toBe('test');
        });
    });    

    describe('Userクラス',()=>{
        let repositoryMock : IUserRepository = new UserRepository();
        repositoryMock.registe = jest.fn(()=>true);
        describe('registe()',()=>{
            it.skip('registe(user)で新規登録出来る',()=>{
                
            });
        })
    });

})