import { query } from '../../Utility/Connection/Connection';
import Exception from '../../Exception/Exception';
import RoomRegister from '../RoomRegister';
import { ROOM_TYPE } from '../../../Enum/Enum';
import logger from '../../../Domain/Utility/logger';
class RoomRepository{

    async getTalkRooms(user_id: string): Promise<RoomInfo[]>{
        const [rows]: any[] = await query('SELECT room_id,rooms.name FROM accessable_rooms JOIN rooms ON rooms.id = accessable_rooms.room_id WHERE accessable_rooms.user_id = ? AND room_type = ? AND accessable_rooms.deleted_at IS NULL',[user_id,ROOM_TYPE.talkroom]);
        return rows.length > 0 ? rows : [];
    }

    async getInformationRoom(user_id: string): Promise<RoomInfo[]>{
        const [rows]: any[] = await query('SELECT room_id,rooms.name FROM accessable_rooms JOIN rooms ON rooms.id = accessable_rooms.room_id WHERE accessable_rooms.user_id = ? AND room_type = ? AND accessable_rooms.deleted_at IS NULL',[user_id,ROOM_TYPE.information]);
        return rows.length > 0 ? rows : [];
    }

    async getDirectMessageRooms(user_id: string): Promise<RoomInfo[]>{
        const [rows]: any[] = await query('SELECT room_id,rooms.name,rooms.creater_id FROM accessable_rooms JOIN rooms ON rooms.id = accessable_rooms.room_id WHERE accessable_rooms.user_id = ? AND room_type = ? AND accessable_rooms.deleted_at IS NULL',[user_id,ROOM_TYPE.directmessage]);
        return rows.length > 0 ? rows : [];
    }

    async getAccessableRooms(user_id: string): Promise<string[]>{
        const [rows]: any[] = await query('SELECT room_id FROM accessable_rooms WHERE user_id = ? AND accessable_rooms.deleted_at IS NULL',[user_id]);
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
        const [rows]: any[] = await query('SELECT * FROM rooms WHERE id = ? ',[id]);
        return rows[0];
    }

    async createRoom(room: RoomRegister): Promise<boolean>{
        const [rows]: any[] = await query('INSERT INTO rooms SET id = ?,name = ?, creater_id = ?, room_type = ?, created_at = NOW()',[room.id,room.name,room.creater_id,room.room_type]);
        return rows.affectedRows == 1;
    }

    async existsSameName(name: string): Promise<boolean>{
        const [rows]: any[] = await query('SELECT * FROM rooms WHERE name = ? AND deleted_at IS NULL',[name]);
        return rows.length > 0;
    }

    async addAccessableRooms(user_id: string,room_id: string): Promise<boolean>{
        logger.debug(`addAccessableRooms(${user_id},${room_id})`);
        const [rows]: any[] = await query('INSERT INTO accessable_rooms SET user_id = ?,room_id = ?, created_at = NOW()',[user_id,room_id]);
        return rows.affectedRows == 1;
    }

    async isAccessable(user_id: string,room_id: string): Promise<boolean>{
        const [rows]: any[] = await query('SELECT * FROM accessable_rooms WHERE user_id = ? AND room_id = ?',[user_id,room_id]);
        return rows.length > 0;
    }

    async getInformationRoomId(user_id: string): Promise<string>{
        const [rows]: any[] = await query("SELECT id FROM rooms JOIN accessable_rooms ON accessable_rooms.user_id = ? AND accessable_rooms.room_id = rooms.id WHERE rooms.room_type = ? AND rooms.deleted_at IS NULL",[user_id,ROOM_TYPE.information]);
        if(rows.length > 0){
            return rows[0].id;
        }
        throw new Exception("指定されたユーザーのルームIDは存在しません。");
    }

    async getDirectMessageRoomId(user1: string,user2: string): Promise<string | null>{

        //user1 == user2 のとき複数の結果が返ってくるが、自分用のDMルームは最初に作られるのでORDER BY created_at している
        const [rows1]: any[] = await query("SELECT room_id FROM accessable_rooms JOIN rooms ON rooms.id = accessable_rooms.room_id AND rooms.room_type = ? WHERE user_id = ? ORDER BY rooms.created_at ",[ROOM_TYPE.directmessage,user1]);
        const [rows2]: any[] = await query("SELECT room_id FROM accessable_rooms JOIN rooms ON rooms.id = accessable_rooms.room_id AND rooms.room_type = ? WHERE user_id = ? ORDER BY rooms.created_at ",[ROOM_TYPE.directmessage,user2]);

        const ary1: string[] = rows1.map((obj: any)=>{
            return obj.room_id;
        });
        const ary2: string[] = rows2.map((obj: any)=>{
            return obj.room_id;
        });

        const result = ary1.filter((room_id: string)=>{
            if(ary2.includes(room_id)){
                return room_id;
            }
        });
      
        return result.length > 0 ? result[0] : null;
    }
    

}
export default RoomRepository;