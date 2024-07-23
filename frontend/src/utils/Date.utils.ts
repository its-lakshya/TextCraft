const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const getDate = (date:string):string => {
  const dateObj = new Date(date);
  const month = monthNames[dateObj?.getMonth()];
  const day = ('0' + dateObj.getDate()).slice(-2);
  const year = dateObj.getFullYear().toString();
  
  const formattedDate = `${month} ${day}, ${year}`;
  return formattedDate
}

export {getDate}