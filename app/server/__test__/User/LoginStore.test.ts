import { mySqlConnector } from "../../Domain/Utility/Connection";
import User from "../../Domain/User/User";
import LoginUsersStore from "../../Store/LoginUsersStore";

describe('LoginStore',()=>{
    const credentials: Credentials = {
        email: 'test@test.com',
        password: 'password'
    };
    const user: User = new User('tester',credentials);
    beforeAll(()=>{
        user.registe();
    });
    afterAll(()=>{
        mySqlConnector.query('TRUNCATE TABLE users');
    });

   it('enqueueできる',()=>{
       LoginUsersStore.enqueue(user);
       expect(LoginUsersStore.inUsers(user.id!)).toBe(true);
   });

   it('deleteできる',()=>{
       expect(LoginUsersStore.delete(user.id!)).toBe(true);
   });

   it('削除済みならfalse',()=>{
       expect(LoginUsersStore.delete(user.id!)).toBe(false);
   });

   it('dequeue()が動く',()=>{
       LoginUsersStore.enqueue(user);
       expect(LoginUsersStore.dequeue()).toBe(user);
       expect(LoginUsersStore.inUsers(user.id!)).toBe(false);
   });

});