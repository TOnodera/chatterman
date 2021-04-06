import DeniedToEnterRoomObserver from "../Observer/DeniedToEnterRoomObserver";

class DeniedToEnterRoomSubject{
    notify(msg: string){
        DeniedToEnterRoomObserver.update(msg);
    }
}

export default new DeniedToEnterRoomSubject;