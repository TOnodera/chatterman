import { Socket } from 'socket.io';
import { ROOM_TYPE } from '../../Enum/Enum';
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
import uuid = require('node-uuid');

class Room implements IRoom {

    protected repository: RoomRepository;
    protected user: User;
    //TODO 削除対象
    protected INFORMATION_ROOM_NAME = "お知らせ";

    constructor(user: User) {
        this.user = user;
        this.repository = RoomRepositoryFactory.create();
    }

    async create(name: string, type: ROOM_TYPE): Promise<RoomEditor> {
        const register: IRoomRegister = new RoomRegister(name, this.user.id, type);
        const id: string = await register.create();
        return await RoomFactory.create(id);
    }

    async createUserDefaultRoom(): Promise<boolean> {
        const name: string = uuid.v4();
        const room: RoomEditor = await this.create(name, ROOM_TYPE.directmessage);
        const result = (await this.addAccessableRooms(room.id)) && (await this.addAccessableRooms('everybody'));
        return result;
    }

    async createInformationRoom(): Promise<boolean> {
        const room: RoomEditor = await this.create(this.INFORMATION_ROOM_NAME, ROOM_TYPE.information);
        const systemUser: IUser = await UserFactory.create(Config.system.superuser);
        const result: boolean = await systemUser.room().addAccessableRooms(room.id) && await this.addAccessableRooms(room.id);
        return result;
    }

    async addAccessableRooms(room_id: string): Promise<boolean> {
        return await this.repository.addAccessableRooms(this.user.id, room_id);
    }

    async getTalkRooms(): Promise<RoomInfo[]> {
        const roomInfos: RoomInfo[] = await this.repository.getTalkRooms(this.user.id);
        return roomInfos;
    }

    async getInformationRoom(): Promise<RoomInfo[]> {
        const roomInfos: RoomInfo[] = await this.repository.getInformationRoom(this.user.id);
        return roomInfos;
    }

    async getInformationRoomId(): Promise<string> {
        return await this.repository.getInformationRoomId(this.user.id);
    }


    async isAccessableRooms(room_id: string): Promise<boolean> {
        return await this.repository.isAccessable(this.user.id, room_id);
    }

    async getAccessableRooms(): Promise<string[]> {
        return await this.repository.getAccessableRooms(this.user.id);
    }

    private async getDirectMessageRoom(user1: string, user2: string): Promise<RoomEditor | null> {
        const room_id: string | null = await this.repository.getDirectMessageRoomId(user1, user2);
        if (room_id) {
            return RoomFactory.create(room_id);
        }
        return null;
    }

    async getDirectMessageRoomInfo(socket: Socket): Promise<Client[]> {

        const users: IUser[] = await userService.getAllUsers();

        //入室可能なルームにソケットをジョイン
        await socketService.joinMe(this.user, socket);

        const members: Client[] = [];
        for (const user of users) {
            const result: Client = { id: user.id, name: user.name };
            const room: RoomEditor | null = await this.getDirectMessageRoom(user.id, this.user.id);
            result.room_id = room ? room.id : user.id; //既にDM出来る相手の場合はそのルームIDを設定
            result.isLogin = loginUsersStore.inUsers(user.id);
            members.push(result);
        }

        return members;
    }

    async enter(info: RoomAndUserId): Promise<boolean> {
        return await this.isAccessableRooms(info.room_id);
    }

    async leave(info: RoomAndUserId): Promise<boolean> {
        return await this.isAccessableRooms(info.room_id);
    }

    getRoomEventEmitter(socket: Socket) {
        return new RoomEventEmitter(socket);
    }
}

export default Room;