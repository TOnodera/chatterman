import { Socket } from 'socket.io';
import { ROOM_TYPE } from '../../Enum/Enum';
import Datetime from '../../Utility/Datetime';
import IUser from '../User/Interface/IUser';
import RoomEventEmitter from './Emitter/RoomEventEmitter';
import RoomFactory from './Factory/RoomFactory';
import RoomRepositoryFactory from './Factory/RoomRepositoryFactory';
import IRoomRegister from './Interface/IRoomRegister';
import RoomRepository from './Repository/RoomRepository';
import RoomEditor from './RoomEditor';
import userService from '../User/Service';
import loginUsersStore from '../../Store/LoginUsersStore';
import socketService from '../../Utility/SocketService';
import UserFactory from '../User/Factory/UserFactory';
import RoomRegister from './RoomRegister';
import Config from '../../Config';
import IRoom from './Interface/IRoom';
import User from '../User/User';
import uuid from 'node-uuid';

class Room implements IRoom {

    private repository: RoomRepository;
    private user: User;
    //TODO 削除対象
    protected INFORMATION_ROOM_NAME = "お知らせ";

    constructor(user: User) {
        this.user = user;
        this.repository = RoomRepositoryFactory.create();
    }

    async create(register: IRoomRegister): Promise<RoomEditor> {
        const id: string = await register.create();
        return await RoomFactory.create(id);
    }

    async createUserDefaultRoom(): Promise<boolean> {
        const register: RoomRegister = new RoomRegister(uuid.v4(), this.user.id, ROOM_TYPE.directmessage);
        const room: RoomEditor = await this.create(register);
        const result = (await this.addAccessableRooms(this.user.id, room.id)) && (await this.addAccessableRooms(this.user.id, 'everybody'));
        return result;
    }

    async createInformationRoom(): Promise<boolean> {
        const register: IRoomRegister = new RoomRegister(this.INFORMATION_ROOM_NAME, this.user.id, ROOM_TYPE.information);
        const room: RoomEditor = await this.create(register);
        const result = (await this.addAccessableRooms(this.user.id, room.id)) && this.addAccessableRooms(Config.system.superuser, room.id);
        return result;
    }

    async addAccessableRooms(user_id: string, room_id: string): Promise<boolean> {
        return await this.repository.addAccessableRooms(user_id, room_id);
    }

    async getTalkRooms(): Promise<RoomInfo[]> {
        const roomInfos: RoomInfo[] = await this.repository.getTalkRooms(this.user.id);
        return roomInfos;
    }

    async getInformationRoom(user_id: string): Promise<RoomInfo[]> {
        const roomInfos: RoomInfo[] = await this.repository.getInformationRoom(user_id);
        return roomInfos;
    }

    async isAccessableRooms(user_id: string, room_id: string): Promise<boolean> {
        return await this.repository.isAccessable(user_id, room_id);
    }

    async getAccessableRooms(user_id: string): Promise<string[]> {
        return await this.repository.getAccessableRooms(user_id);
    }

    async getInformationRoomId(user_id: string): Promise<string> {
        return await this.repository.getInformationRoomId(user_id);
    }

    async getDirectMessageRoom(user1: string, user2: string): Promise<RoomEditor | null> {
        const room_id: string | null = await this.repository.getDirectMessageRoomId(user1, user2);
        if (room_id) {
            return RoomFactory.create(room_id);
        }
        return null;
    }

    async getDirectMessageRoomInfo(my_id: string, socket: Socket): Promise<Client[]> {
        const users: IUser[] = await userService.getAllUsers();

        //入室可能なルームにソケットをジョイン
        const me: IUser = await userService.getUserById(my_id);
        await socketService.joinMe(me, socket);

        const members: Client[] = [];
        for (const user of users) {
            const result: Client = { id: user.id, name: user.name };
            const room: RoomEditor | null = await this.getDirectMessageRoom(user.id, my_id);

            result.room_id = room ? room.id : user.id; //既にDM出来る相手の場合はそのルームIDを設定
            result.isLogin = loginUsersStore.inUsers(user.id);
            members.push(result);
        }

        return members;
    }

    async enter(info: RoomAndUserId): Promise<boolean> {
        const user: IUser = await UserFactory.create(info.user_id);
        return await this.isAccessableRooms(user.id, info.room_id);
    }

    async leave(info: RoomAndUserId): Promise<boolean> {
        const user: IUser = await UserFactory.create(info.user_id);
        return await this.isAccessableRooms(user.id, info.room_id);
    }

    getRoomEventEmitter(socket: Socket) {
        return new RoomEventEmitter(socket);
    }
}

export default Room;