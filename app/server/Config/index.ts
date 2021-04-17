import databaseConfig from './database.config';
import sysconfig from './system.config';

const Config = {
    database: databaseConfig,
    system: sysconfig
} as any;

const corsSetting = {
    cors: {
        origin: Config.system.cors,
        methods: ['GET', 'POST'],
        credentials: true
    }
}

export default Config;
export {
    corsSetting
}
