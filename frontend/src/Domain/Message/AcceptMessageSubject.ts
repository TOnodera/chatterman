import messageDomain from './Message';
import AcceptMessageObserver from './AcceptMessageObserver';

class AcceptMessageSubject {
    notify(fromServer: any) {
        const messages: any[] = messageDomain.get(fromServer.room_id);
        messages.push(fromServer);
        messageDomain.set(fromServer.room_id, messages);
        AcceptMessageObserver.update(messageDomain.get(fromServer.room_id));
    }
}

export default new AcceptMessageSubject;