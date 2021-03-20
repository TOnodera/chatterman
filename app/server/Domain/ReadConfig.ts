import config from '../config';
class ReadConfig{
    static dabtabaseConfig() : any{
        return config.database;
    }
}
export { ReadConfig };