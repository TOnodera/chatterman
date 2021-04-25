import { ROOM_TYPE } from "server/Enum/Enum";
import { Socket } from "socket.io";
import RoomEventEmitter from "../Emitter/RoomEventEmitter";
import RoomEditor from "../RoomEditor";

interface IRoom {
    create(name: string, type: ROOM_TYPE): Promise<RoomEditor>;
    createUserDefaultRoom(): Promise<boolean>;
    createInformationRoom(): Promise<boolean>;
    addAccessableRooms(room_id: string): Promise<boolean>;
    getTalkRooms(): Promise<RoomInfo[]>;
    getInformationRoom(): Promise<RoomInfo>;
    isAccessableRooms(room_id: string): Promise<boolean>;
    getAccessableRooms(): Promise<string[]>;
    getDirectMessageRoomInfo(socket: Socket): Promise<Client[]>;
    enter(info: RoomAndUserId): Promise<boolean>;
    leave(info: RoomAndUserId): Promise<boolean>;
    getRoomEventEmitter(socket: Socket): RoomEventEmitter;
}

export default IRoom;