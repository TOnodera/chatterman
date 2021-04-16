import AcceptUsersObserver from '../Observer/AcceptUsersObserver';
class AcceptUsersSubject {
  notify (users: any[]) {
    AcceptUsersObserver.update(users);
  }
}
export default new AcceptUsersSubject();
