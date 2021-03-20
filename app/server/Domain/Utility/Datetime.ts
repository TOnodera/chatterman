import moment, { Moment } from 'moment';
class Datetime{
    datetime: Moment
    constructor(datetime?: string){
        this.datetime = datetime ? moment(datetime) : moment();
    }
    get() : Moment{
        return this.datetime;
    }
}
export default Datetime;