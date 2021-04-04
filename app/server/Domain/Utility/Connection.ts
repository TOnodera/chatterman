import { createPool } from 'mysql2/promise';
import config from '../../config';

const mySqlConnector = createPool(config.database.mysql);
export {mySqlConnector};