import AcceptUsersObserver from '../Observer/AcceptUsersObserver';
class AcceptUsersSubject{
    notify(users: any[]){
        AcceptUsersObserver.handler(users);
    }
}
export default new AcceptUsersSubject();