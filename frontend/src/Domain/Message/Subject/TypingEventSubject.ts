import TypingEventObserver from '../Observer/TypingEventObserver';
class TypingEventSubject{
    notify(info: {user_name: string,room_id: string}){
        TypingEventObserver.update(info);
    }
}
export default new TypingEventSubject();