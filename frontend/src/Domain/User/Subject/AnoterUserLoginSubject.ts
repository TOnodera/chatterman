import AnotherUserLoginObserver from '../Observer/AnotherUserLoginObserver';
class AnotherUserLoginSubject{
    notify(id: string){
        AnotherUserLoginObserver.update(id);
    }
}
export default new AnotherUserLoginSubject();