import { mySqlConnector } from '../../../../Domain/Utility/Connection';
import ApplyPolymorphicRepository from '../Repository/ApplyPolymorphicRepository';

class ApplyPolymorphicRepositoryFactory{
    static create(){
        return new ApplyPolymorphicRepository(mySqlConnector);
    }
}
export default ApplyPolymorphicRepositoryFactory;