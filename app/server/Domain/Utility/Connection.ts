import { createPool } from 'mysql2/promise';
import config from '../../config';

const mySqlConnector = createPool(config.database.mysql);

/**
 * @param func トランザクション処理を行う場合はこの中で書いてください。値を返す場合は必ず配列で返して下さい。
 */
const transaction = async (func: Function): Promise<any[]> => {
    let response: any[] = [];
    const connection = mySqlConnector.getConnection();
    try{

        let checker: any = null;

        (await connection).beginTransaction();
        checker = await func();

        if(checker && Array.isArray(checker)){
            response = checker;
        }

        (await connection).commit();

    }catch(e){
        (await connection).rollback();
        throw e;
    }
    return response;
}
export { mySqlConnector, transaction };