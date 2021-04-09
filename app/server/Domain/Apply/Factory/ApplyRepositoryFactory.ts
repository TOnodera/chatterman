import {mySqlConnector} from '../../Utility/Connection';
import ApplyRepository from '../Repository/ApplyRepository';

class ApplyRepositoryFactory{
    static create(){
        return new ApplyRepository(mySqlConnector);
    }
}
export default ApplyRepositoryFactory;