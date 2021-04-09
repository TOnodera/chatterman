
import { MessageOptions } from "server/@types/types";
import IMessageOptionsRepository from "./IMessageOptionsRepository";
import { Pool } from "mysql2/promise";

class MessageOptionsRepository implements IMessageOptionsRepository{
    
    private connector: Pool;

    constructor(connector: Pool){
        this.connector = connector;
    }
    
    async add(message_id: string,messageOption: MessageOptions): Promise<boolean> {
        const [rows]: any[] = await this.connector.query("INSERT INTO message_polymorphics SET message_id = ?,polymorphic_table = ?, polymorphic_id = ?,created_at = NOW()",[message_id,messageOption.polymorphic_table,messageOption.polymorphic_id]);
        return rows.affectedRows == 1;
    }
}

export default MessageOptionsRepository;