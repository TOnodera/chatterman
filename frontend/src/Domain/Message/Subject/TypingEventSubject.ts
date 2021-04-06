import TypingEventObserver from '../Observer/TypingEventObserver';
class TypingEventSubject{
    notify(user: User,room_id: string){
        TypingEventObserver.update(user,room_id);
    }
}
export default new TypingEventSubject();