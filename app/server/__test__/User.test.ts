import User from '..//Domain/User/User';
import { connector } from '../Domain/Utility/Connection';
import UserRepository from '../Domain/User/UserRepository';

describe('User',()=>{

    describe('Userクラス',()=>{
        beforeEach(async ()=>{
            await connector.query('TRUNCATE TABLE users');
        });
        describe('registe()',()=>{
            it('registe(user)で新規登録出来る',async ()=>{
                const email = 'test@test.com';
                const user = new User('test',{email: email,password: 'password'});
                await user.registe();     
                const repository = new UserRepository();
                const getUser = await repository.getUserByEmail(email);
                expect(getUser && getUser.credentials.email).toBe(email);
            });
        })
    });

})