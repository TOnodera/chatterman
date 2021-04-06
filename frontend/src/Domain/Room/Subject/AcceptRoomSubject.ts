import AcceptRoomsObserver from "../Observer/AcceptRoomsObserver";

class AcceptRoomSubject{
    notify(rooms: any[]){
        AcceptRoomsObserver.update(rooms);
    }
}

export default new AcceptRoomSubject;