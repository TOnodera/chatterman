import { createPool } from 'mysql2/promise';
const mySqlConnector = createPool ({
    host: 'mysql',
    user: 'root',
    password: 'password',
    database: 'chater_test'
  });
  export {mySqlConnector};