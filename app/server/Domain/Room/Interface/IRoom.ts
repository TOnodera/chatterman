import { Socket } from "socket.io";
import RoomEventEmitter from "../Emitter/RoomEventEmitter";
import RoomEditor from "../RoomEditor";
import IRoomRegister from "./IRoomRegister";

interface IRoom {
    create(register: IRoomRegister): Promise<RoomEditor>;
    createUserDefaultRoom(): Promise<boolean>;
    createInformationRoom(): Promise<boolean>;
    addAccessableRooms(user_id: string, room_id: string): Promise<boolean>;
    getTalkRooms(user_id: string): Promise<RoomInfo[]>;
    getInformationRoom(user_id: string): Promise<RoomInfo[]>;
    isAccessableRooms(user_id: string, room_id: string): Promise<boolean>;
    getAccessableRooms(user_id: string): Promise<string[]>;
    getInformationRoomId(): Promise<string>;
    getDirectMessageRoom(user1: string, user2: string): Promise<RoomEditor | null>;
    getDirectMessageRoomInfo(socket: Socket): Promise<Client[]>;
    enter(info: RoomAndUserId): Promise<boolean>;
    leave(info: RoomAndUserId): Promise<boolean>;
    getRoomEventEmitter(socket: Socket): RoomEventEmitter;
}

export default IRoom;