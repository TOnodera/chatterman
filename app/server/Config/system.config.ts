export default {
    superuser: process.env.SYSTEM_USER,
    cors: process.env.ARROWED_CORS?.split(','),
    cookie_secret: process.env.COOKIE_SECRET
};
