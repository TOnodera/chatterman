import { mySqlConnector } from '../../../Domain/Utility/Connection';
import PolymorphicRepository from '../Repository/PolymorphicRepository';

class PolymorphicRepositoryFactory{
    static create(){
        return new PolymorphicRepository(mySqlConnector);
    }
}
export default PolymorphicRepositoryFactory;