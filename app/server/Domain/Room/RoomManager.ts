import { RoomAndUserId, RoomInfo, RoomType } from 'server/@types/types';
import { Socket } from 'socket.io';
import User from '../User/User';
import UserFactory from '../User/UserFactory';
import logger from '../Utility/logger';
import Room from './Room';
import RoomFactory from './RoomFactoryy';
import RoomRegister from './RoomRegister';
import repository from './RoomRepository';
class RoomManager {

    private repository: any;
    constructor() {
        this.repository = repository;
    }

    async attemptToEnter(info: RoomAndUserId): Promise<boolean> {
        const user: User = await UserFactory.create(info.user_id);
        if (await user.isAccessable(info.room_id)) {
            return true;
        }
        return false;
    }

    async leaveCurrentRoom(info: RoomAndUserId): Promise<boolean> {
        const user: User = await UserFactory.create(info.user_id);
        if (await user.isAccessable(info.room_id)) {
            return true;
        }
        return false;
    }

    async createRoom(name: string,creater_id: string, room_type: RoomType): Promise<Room> {
        const register = new RoomRegister(name,creater_id,room_type);
        const id: string = await register.create();
        return await RoomFactory.create(id);
    }

    async createUserDefaultRoom(user_id: string, room_typs: RoomType): Promise<boolean> {
        const room: Room = await this.createRoom(user_id, user_id,room_typs);
        const result = await this.addAccessableRooms(user_id, room.id) && await this.addAccessableRooms(user_id, 'everybody');
        return result;
    }

    async addAccessableRooms(user_id: string, room_id: string): Promise<boolean> {
        return await this.repository.addAccessableRooms(user_id, room_id);
    }

    async getAllRooms(user_id: string): Promise<RoomInfo[]> {
        return await this.repository.getAllRooms(user_id);
    }

    join(room_id: string,socket: Socket){
        socket.join(room_id);
    }

    async joinUser(user: User,socket: Socket){
        for(let room_id of await user.accessAbleRooms()){
            logger.warn(room_id);
            this.join(room_id,socket);
        }
    }

    async isAccessableRooms(user_id: string,room_id: string): Promise<boolean>{
        return await this.repository.isAccessable(user_id,room_id);
    }

    async getAccessableRooms(user_id: string): Promise<string[]>{
        return await this.repository.getAccessableRooms(user_id);
    }

}
export default new RoomManager();