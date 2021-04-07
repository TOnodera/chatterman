import {mySqlConnector} from '../Utility/Connection';
class ApplyRepositoryFactory{
    static create(){
        return new ApplyRepository(mySqlConnector);
    }
}
export default ApplyRepositoryFactory;