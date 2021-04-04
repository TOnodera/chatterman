import messageDomain from './Message';
import AcceptMessageObserver from './AcceptMessageObserver';

class AcceptMessageSubject {
    notify(fromServer: any) {
        const messages: any[] = messageDomain.get(fromServer.room_id);
        messages.push(fromServer);
        messageDomain.set(fromServer.room_id, messages);
        //日付順にソートして渡す
        const sortedMessages = messageDomain.get(fromServer.room_id).sort((a,b) => (new Date(a.created_at)).getTime() - (new Date(b.created_at)).getTime());
        AcceptMessageObserver.update(sortedMessages);
    }
}

export default new AcceptMessageSubject;