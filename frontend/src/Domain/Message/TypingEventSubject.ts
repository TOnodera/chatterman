import TypingEventObserver from './TypingEventObserver';
class TypingEventSubject{
    notify(user: User){
        TypingEventObserver.update(user);
    }
}
export default new TypingEventSubject();