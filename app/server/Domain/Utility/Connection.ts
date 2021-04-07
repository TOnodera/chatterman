import { createPool } from 'mysql2/promise';
import config from '../../config';

const mySqlConnector = createPool(config.database.mysql);
const transaction = async (func: Function): Promise<any[]> => {
    let response: any[] = [];
    const connection = mySqlConnector.getConnection();
    try{

        let checker: any[] = [];

        (await connection).beginTransaction();
        checker = await func();
        (await connection).commit();

        if(checker.length > 0){
            response = checker;
        }

    }catch(e){
        (await connection).rollback();
        throw e;
    }
    return response;
}
export { mySqlConnector, transaction };