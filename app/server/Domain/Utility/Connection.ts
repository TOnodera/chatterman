import { createPool } from 'mysql2/promise';
import config from '../../config';
import Exception from '../Exception/Exception';

const mySqlConnector = createPool(config.database.mysql);
const transaction = (func: Function) => {
    try{
        mySqlConnector.query('START TRANSACTION');
        func();
        mySqlConnector.query('COMMIT');
    }catch(e){
        mySqlConnector.query('ROLLBACK');
        throw new Exception('データベース処理に失敗しました。');
    }
}
export {mySqlConnector,transaction};