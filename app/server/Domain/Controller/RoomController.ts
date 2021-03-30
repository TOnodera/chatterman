import { Socket } from 'socket.io';
import roomManager from '../Room/RoomManager';
class RoomController{
    async attemptToEnter(info: RoomAndUserId,socket: Socket){
        await roomManager.attemptToEnter(info,socket);
    }
    async leaveCurrentRoom(info: RoomAndUserId,socket: Socket){
        await roomManager.leaveCurrentRoom(info,socket);
    }
}
export default new RoomController();