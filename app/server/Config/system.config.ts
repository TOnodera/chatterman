export default {
    superuser: process.env.SYSTEM_USER,
    cors: process.env.ARROWED_CORS?.split(','),
    cookie_secret: process.env.COOKIE_SECRET,
    prod_port: process.env.PROD_PORT,
    test_port: process.env.TEST_PORT
};