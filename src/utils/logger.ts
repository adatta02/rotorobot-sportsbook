import * as moment from 'moment';

export function log(arg: string) {
  const d = moment().format();
  console.log(`${d}:`, arg);
}