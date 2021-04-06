import TypingEventObserver from '../Observer/TypingEventObserver';
class TypingEventSubject{
    notify(user: User){
        TypingEventObserver.update(user);
    }
}
export default new TypingEventSubject();