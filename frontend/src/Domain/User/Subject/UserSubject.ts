import UserObserver from '../Observer/UserObserver';
class UserSubject{
    notify(msg: string){
        UserObserver.update(msg);
    }
}
export default new UserSubject();