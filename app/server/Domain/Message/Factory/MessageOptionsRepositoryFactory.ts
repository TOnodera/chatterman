import { Pool } from "mysql2/promise";
import MessageOptionsRepository from "../Repository/MessageOptionsRepository";
import { mySqlConnector } from '../../Utility/Connection';

class MessageOptionsRepositoryFactory{
    static create(){
        return new MessageOptionsRepository(mySqlConnector);
    }
}

export default MessageOptionsRepositoryFactory;