import { Socket } from 'socket.io';
import User from '../User/User';
import UserFactory from '../User/Factory/UserFactory';
import userManager from '../User/UserManager';
import Room from './Room';
import RoomFactory from './Factory/RoomFactory';
import RoomRegister from './RoomRegister';
import roomRepositoryFactory from './Factory/RoomRepositoryFactory';
import config from '../../Config';
import { ROOM_TYPE } from '../../Enum/Enum';
import loginUsersStore from '../../Store/LoginUsersStore';
import RoomEventEmitter from './Emitter/RoomEventEmitter';
import socketService from '../Utility/SocketService';

class RoomManager {
    private INFORMATION_ROOM_NAME = 'お知らせ';
    private SUPER_USER = config.system.superuser;
    private repository: any;

    constructor() {
        this.repository = roomRepositoryFactory.create();
    }

    async attemptToEnter(info: RoomAndUserId): Promise<boolean> {
        const user: User = await UserFactory.create(info.user_id);
        return await user.isAccessable(info.room_id);
    }

    async leaveCurrentRoom(info: RoomAndUserId): Promise<boolean> {
        const user: User = await UserFactory.create(info.user_id);
        return await user.isAccessable(info.room_id);
    }

    async createRoom(name: string, creater_id: string, room_type: ROOM_TYPE): Promise<Room> {
        const register = new RoomRegister(name, creater_id, room_type);
        const id: string = await register.create();
        return await RoomFactory.create(id);
    }

    async createUserDefaultRoom(user_id: string, room_typs: ROOM_TYPE): Promise<boolean> {
        const room: Room = await this.createRoom(user_id, user_id, room_typs);
        const result = (await this.addAccessableRooms(user_id, room.id)) && (await this.addAccessableRooms(user_id, 'everybody'));
        return result;
    }

    async createInformationRoom(user_id: string): Promise<boolean> {
        const room: Room = await this.createRoom(this.INFORMATION_ROOM_NAME, user_id, ROOM_TYPE.information);
        const result = (await this.addAccessableRooms(user_id, room.id)) && this.addAccessableRooms(this.SUPER_USER, room.id);
        return result;
    }

    async addAccessableRooms(user_id: string, room_id: string): Promise<boolean> {
        return await this.repository.addAccessableRooms(user_id, room_id);
    }

    async getTalkRooms(user_id: string): Promise<RoomInfo[]> {
        const roomInfos: RoomInfo[] = await this.repository.getTalkRooms(user_id);
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

    async getDirectMessageRoom(user1: string, user2: string): Promise<Room | null> {
        const room_id: string | null = await this.repository.getDirectMessageRoomId(user1, user2);
        if (room_id) {
            return RoomFactory.create(room_id);
        }
        return null;
    }

    async getDirectMessageRoomInfo(my_id: string, socket: Socket): Promise<Client[]> {
        const users: User[] = await userManager.getAllUsers();

        //入室可能なルームにソケットをジョイン
        const me: User = await userManager.getUserById(my_id);
        await socketService.joinMe(me, socket);

        const members: Client[] = [];
        for (const user of users) {
            const result: Client = { id: user.id, name: user.name };
            const room: Room | null = await this.getDirectMessageRoom(user.id, my_id);

            result.room_id = room ? room.id : user.id; //既にDM出来る相手の場合はそのルームIDを設定
            result.isLogin = loginUsersStore.inUsers(user.id);
            members.push(result);
        }

        return members;
    }

    getRoomEventEmitter(socket: Socket) {
        return new RoomEventEmitter(socket);
    }
}
export default new RoomManager();
