import { createPool } from 'mysql2/promise';
const connector = createPool ({
    host: 'mysql',
    user: 'root',
    password: 'password',
    database: 'chater_test'
  });
  export {connector};