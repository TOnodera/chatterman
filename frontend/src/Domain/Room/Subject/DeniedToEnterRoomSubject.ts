import DeniedToEnterRoomObserver from "../Observer/DeniedToEnterRoomObserver";

class DeniedToEnterRoomSubject{
    notify(){
        DeniedToEnterRoomObserver.update();
    }
}

export default new DeniedToEnterRoomSubject;