export default {
    superuser: process.env.SYSTEM_USER,
    baseUrl: 'http://localhost:3000',
    cors: process.env.ARROWED_CORS?.split(',')
};