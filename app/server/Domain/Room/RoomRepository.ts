import {mySqlConnector} from '../Utility/Connection';
import Room from './Room';
class RoomRepository{

    private connector: any;

    constructor(){
        this.connector = mySqlConnector;
    }

    async getAllRooms(user_id: string): Promise<RoomInfo[]>{
        const [rows]: any[] = await this.connector.query('SELECT room_id,rooms.name FROM accessable_rooms JOIN rooms ON rooms.id = accessable_rooms.room_id WHERE accessable_rooms.user_id = ? AND accessable_rooms.deleted_at IS NULL',[user_id]);
        return rows.length > 0 ? rows : [];
    }

    async getRoom(id: string): Promise<any[]>{
        const [rows]: any[] = await this.connector.query('SELECT * FROM rooms WHERE id = ? ',[id]);
        return rows[0];
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