import moment, { Moment } from 'moment';
class Datetime{
    datetime: Moment
    constructor(datetime?: string){
        this.datetime = datetime ? moment(datetime) : moment();
    }
    get() : string{
        return this.datetime.format("Y-M-D h:m:s");
    }
}
export default Datetime;