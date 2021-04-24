import { Socket } from "socket.io";
import RoomEditor from "../RoomEditor";
import IRoomRegister from "./IRoomRegister";

interface IRoom {
    create(register: IRoomRegister): Promise<RoomEditor>;
    createUserDefaultRoom(register: IRoomRegister): Promise<boolean>;
    createInformationRoom(user_id: string): Promise<boolean>;
    addAccessableRooms(user_id: string, room_id: string): Promise<boolean>;
    getTalkRooms(user_id: string): Promise<RoomInfo[]>;
    getInformationRoom(user_id: string): Promise<RoomInfo[]>;
    isAccessableRooms(user_id: string, room_id: string): Promise<boolean>;
    getAccessableRooms(user_id: string): Promise<string[]>;
    getInformationRoomId(user_id: string): Promise<string>;
    getDirectMessageRoom(user1: string, user2: string): Promise<RoomEditor | null>;
    getDirectMessageRoomInfo(my_id: string, socket: Socket): Promise<Client[]>;
}

export default IRoom;