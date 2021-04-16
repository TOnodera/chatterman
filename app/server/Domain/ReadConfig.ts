import config from '../Config';
class ReadConfig {
    static dabtabaseConfig(): any {
        return config.database;
    }
}
export { ReadConfig };
