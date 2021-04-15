import { Moment } from "moment";
import moment = require("moment");
class Datetime {
  datetime: Moment;
  constructor(datetime?: string) {
    this.datetime = datetime ? moment(datetime) : moment();
  }
  get(): string {
    return this.datetime.format("Y-M-D HH:mm:ss");
  }
}
export default Datetime;
