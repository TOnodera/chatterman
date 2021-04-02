import {mySqlConnector} from '../Utility/Connection';
import Room from './Room';
class RoomRepository{
    private connector: any;
    constructor(){
        this.connector = mySqlConnector;
    }
    async getRoomIds(user_id: string): Promise<{rooms?: any[],exist: boolean}>{
        const [rows]: any[] = await this.connector.query('SELECT room_id FROM accessable_rooms WHERE user_id = ? AND deleted_at IS NULL',[user_id]);
        return rows.length > 0 ? {rooms: rows,exist: true} : {exist: false};
    }
    async createRoom(room: Room): Promise<boolean>{
        const [rows]: any[] = await this.connector.query('INSERT INTO rooms SET id = ?,name = ?, creater_id = ?, created_at = NOW()',[room.id,room.name,room.creater_id]);
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
    async begin(){
        await this.connector.query('BEGIN');
    }
    async commit(){
        await this.connector.query('COMMIT');
    }
    async rollback(){
        await this.connector.query('ROLLBACK');
    }

}
export default new RoomRepository;