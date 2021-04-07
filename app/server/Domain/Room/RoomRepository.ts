import { RoomInfo, RoomType } from 'server/@types/types';
import {mySqlConnector} from '../Utility/Connection';
import logger from '../Utility/logger';
import Room from './Room';
import RoomRegister from './RoomRegister';
class RoomRepository{

    private connector: any;

    constructor(){
        this.connector = mySqlConnector;
    }

    async getTalkRooms(user_id: string): Promise<RoomInfo[]>{
        const [rows]: any[] = await this.connector.query('SELECT room_id,rooms.name FROM accessable_rooms JOIN rooms ON rooms.id = accessable_rooms.room_id WHERE accessable_rooms.user_id = ? AND room_type = ? AND accessable_rooms.deleted_at IS NULL',[user_id,'talkroom']);
        return rows.length > 0 ? rows : [];
    }

    async getDirectMessageRooms(user_id: string): Promise<RoomInfo[]>{
        const [rows]: any[] = await this.connector.query('SELECT room_id,rooms.name,rooms.creater_id FROM accessable_rooms JOIN rooms ON rooms.id = accessable_rooms.room_id WHERE accessable_rooms.user_id = ? AND room_type = ? AND accessable_rooms.deleted_at IS NULL',[user_id,'directmessage']);
        return rows.length > 0 ? rows : [];
    }

    async getAccessableRooms(user_id: string): Promise<string[]>{
        const [rows]: any[] = await this.connector.query('SELECT room_id FROM accessable_rooms WHERE user_id = ? AND accessable_rooms.deleted_at IS NULL',[user_id]);
        if(rows.length > 0){
            let result: string[] = [];
            for(let room of rows){
                result.push(room.room_id);
            }
            return result;
        }
        return [];
    }

    async getRoom(id: string): Promise<any>{
        const [rows]: any[] = await this.connector.query('SELECT * FROM rooms WHERE id = ? ',[id]);
        return rows[0];
    }

    async createRoom(room: RoomRegister): Promise<boolean>{
        const [rows]: any[] = await this.connector.query('INSERT INTO rooms SET id = ?,name = ?, creater_id = ?, room_type = ?, created_at = NOW()',[room.id,room.name,room.creater_id,room.room_type.Type]);
        return rows.affectedRows == 1;
    }

    async existsSameName(name: string): Promise<boolean>{
        const [rows]: any[] = await this.connector.query('SELECT * FROM rooms WHERE name = ? AND deleted_at IS NULL',[name]);
        return rows.length > 0;
    }

    async addAccessableRooms(user_id: string,room_id: string): Promise<boolean>{
        const [rows]: any[] = await this.connector.query('INSERT INTO accessable_rooms SET user_id = ?,room_id = ?, created_at = NOW()',[user_id,room_id]);
        return rows.affectedRows == 1;
    }

    async isAccessable(user_id: string,room_id: string): Promise<boolean>{
        const [rows]: any[] = await this.connector.query('SELECT * FROM accessable_rooms WHERE user_id = ? AND room_id = ?',[user_id,room_id]);
        return rows.length > 0;
    }

}
export default new RoomRepository;