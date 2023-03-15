export function convertDecimalToAmerican(odds: number) {
  if(odds > 2) {
    return ((odds - 1) * 100).toFixed(0);
  }else{
    return (-100 / (odds - 1)).toFixed(0);
  }
}