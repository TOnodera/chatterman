export default {
    mysql: {
        host: 'mysql',
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD
    },
    mysql_test: {
        host: 'mysql',
        database: process.env.MYSQL_TEST_DATABASE,
        user: process.env.MYSQL_TEST_USER,
        password: process.env.MYSQL_TEST_PASSWORD
    }
};
