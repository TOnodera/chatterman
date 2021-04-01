import {mySqlConnector} from '../Utility/Connection';
class RoomRepository{
    private connector: any;
    constructor(){
        this.connector = mySqlConnector;
    }
    async getRoomIds(user_id: string): Promise<{rooms?: any[],exist: boolean}>{
        const [rows]: any[] = await this.connector.query('SELECT room_id FROM accessable_rooms WHERE user_id = ? AND deleted_at IS NULL',[user_id]);
        return rows.length > 0 ? {rooms: rows,exist: true} : {exist: false};
    }
    async addRoom(room: Room): Promise<boolean>{
        const [rows]: any[] = await this.connector.query('INSERT INTO rooms SET id = ?,name = ?, creater_id = ?, created_at = NOW()',[room.id,room.name,room.creater_id]);
        return rows.affectedRows == 1;
    }
}