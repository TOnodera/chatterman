import { Connection, createConnection } from 'mysql2/promise';
import Config from '../../../config';
import Datetime from '../Datetime';
import logger from '../logger';

class MySqlConnection {
    private static connection: any = null;
    private constructor() {}

    static async getConnection(): Promise<Connection> {
        if (!this.connection) {
            this.connection = await createConnection(Config.database.mysql);
        }
        return this.connection;
    }
}

/**
 * @param func トランザクションを囲うコールバック関数
 * トランザクション処理を行う場合はこの中で書いてください。値を返す場合は必ず配列で返して下さい。
 */
const transaction = async (func: Function): Promise<any[]> => {
    const connection = await MySqlConnection.getConnection();
    let response: any[] = [];

    try {
        let checker: any = null;

        logger.info('トランザクション開始', new Datetime());

        await connection.beginTransaction();

        //戻り値あれば配列で返す為の処理
        checker = await func();
        if (checker && Array.isArray(checker)) {
            response = checker;
        }

        await connection.commit();

        logger.info('トランザクション正常終了', new Datetime());
    } catch (e) {
        await connection.rollback();
        logger.info('トランザクションエラー発生', new Datetime());
        throw e;
    }
    return response;
};

/**
 *
 * @param sql : string
 * @param values : any[]
 * 普通のクエリ実行関数
 */
const query = async (sql: string, values: any[]) => {
    const connection: Connection = await MySqlConnection.getConnection();
    return await connection.query(sql, values);
};

export { query, transaction };
