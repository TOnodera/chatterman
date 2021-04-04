import { createPool } from 'mysql2/promise';
import config from '../../config';

const mySqlConnector = createPool(config.database.mysql);
const transaction = async (func: Function) => {
    const connection = mySqlConnector.getConnection();
    try{
        (await connection).beginTransaction();
        await func();
        (await connection).commit();
    }catch(e){
        (await connection).rollback();
        throw e;
    }
}
export { mySqlConnector, transaction };