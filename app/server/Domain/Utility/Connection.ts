import { createPool } from 'mysql2/promise';
import config from '../../config';
import Datetime from './Datetime';
import logger from './logger';

const mySqlConnector = createPool(config.database.mysql);

/**
 * @param func トランザクション処理を行う場合はこの中で書いてください。値を返す場合は必ず配列で返して下さい。
 */
const transaction = async (func: Function): Promise<any[]> => {
    let response: any[] = [];
    const connection = mySqlConnector.getConnection();
    try{

        let checker: any = null;

        logger.info("トランザクション開始",new Datetime());

        (await connection).beginTransaction();
        checker = await func();

        if(checker && Array.isArray(checker)){
            response = checker;
        }

        (await connection).commit();

        logger.info("トランザクション正常終了",new Datetime());


    }catch(e){
        (await connection).rollback();
        logger.info("トランザクションエラー発生",new Datetime());
        throw e;
    }
    return response;
}
export { mySqlConnector, transaction };