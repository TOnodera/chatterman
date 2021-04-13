import { Socket } from 'socket.io';
import User from '../User/User';
import UserFactory from '../User/Factory/UserFactory';
import logger from '../Utility/logger';
import Room from './Room';
import RoomFactory from './Factory/RoomFactory';
import RoomRegister from './RoomRegister';
import roomRepositoryFactory from './Factory/RoomRepositoryFactory';
import config from '../../config';
import { ROOM_TYPE } from '../../enum/enum';

class RoomManager {

    private INFORMATION_ROOM_NAME = "お知らせ";
    private SUPER_USER = config.system.superuser;
    private repository: any;
    constructor() {
        this.repository = roomRepositoryFactory.create();
    }

    async attemptToEnter(info: RoomAndUserId): Promise<boolean> {
        logger.info("入場　試行");
        const user: User = await UserFactory.create(info.user_id);
        if (await user.isAccessable(info.room_id)) {
            logger.info("入場　成功",user.name);
            return true;
        }
        logger.info("入場　拒否");
        return false;
    }

    async leaveCurrentRoom(info: RoomAndUserId): Promise<boolean> {
        const user: User = await UserFactory.create(info.user_id);
        if (await user.isAccessable(info.room_id)) {
            return true;
        }
        return false;
    }

    async createRoom(name: string,creater_id: string, room_type: ROOM_TYPE): Promise<Room> {
        const register = new RoomRegister(name,creater_id,room_type);
        const id: string = await register.create();
        return await RoomFactory.create(id);
    }

    async createUserDefaultRoom(user_id: string, room_typs: ROOM_TYPE): Promise<boolean> {
        const room: Room = await this.createRoom(user_id, user_id,room_typs);
        const result = await this.addAccessableRooms(user_id, room.id) && await this.addAccessableRooms(user_id, 'everybody');
        return result;
    }

    async createInformationRoom(user_id:string): Promise<boolean>{
        const room: Room = await this.createRoom(this.INFORMATION_ROOM_NAME, user_id,ROOM_TYPE.information);
        const result = await this.addAccessableRooms(user_id, room.id) && this.addAccessableRooms(this.SUPER_USER,room.id);
        return result;
    }

    async addAccessableRooms(user_id: string, room_id: string): Promise<boolean> {
        return await this.repository.addAccessableRooms(user_id, room_id);
    }

    async getTalkRooms(user_id: string): Promise<RoomInfo[]> {
        return await this.repository.getTalkRooms(user_id);
    }

    async getInformationRoom(user_id: string): Promise<RoomInfo[]> {
        return await this.repository.getInformationRoom(user_id);
    }

    join(room_id: string,socket: Socket){
        socket.join(room_id);
    }

    async joinUser(user: User,socket: Socket){
        for(let room_id of await user.accessAbleRooms()){
            this.join(room_id,socket);
        }
    }

    async isAccessableRooms(user_id: string,room_id: string): Promise<boolean>{
        return await this.repository.isAccessable(user_id,room_id);
    }

    async getAccessableRooms(user_id: string): Promise<string[]>{
        const rooms = await this.repository.getAccessableRooms(user_id);
        logger.debug("アクセス可能なルーム：",rooms);
        return rooms;
    }

    async getInformationRoomId(user_id: string): Promise<string>{
        return await this.repository.getInformationRoomId(user_id);
    }

}
export default new RoomManager();