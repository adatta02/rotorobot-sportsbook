import * as moment from 'moment';

export function log(...args: any) {
  const d = moment().format();
  console.log(`${d}:`, args);
}