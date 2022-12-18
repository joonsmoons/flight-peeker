const formatDate = (date) => {
  // dd/mm/YYYY
  return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getFullYear()}`;
};

const formatDateKR = (date) => {
  // YYYYmmdd
  return `${date.getFullYear()}${String(date.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}${String(date.getUTCDate()).padStart(2, "0")}`;
};

const getCurrentDatetime = () => {
  const currentDate = new Date();
  const offset = currentDate.getTimezoneOffset();
  const currentDatetime = currentDate.getTime() - offset * 60 * 1000;
  return currentDatetime;
};

const getSpreadDateRangeYear = (current) => {
  const day = 3600 * 1000 * 24;
  const dateAddRange = [...Array(366).keys()];
  return dateAddRange.map((add) => formatDate(new Date(current + day * add)));
};

const getYearRangeFromCurrent = () => {
  const currentDatetime = getCurrentDatetime();
  return getSpreadDateRangeYear(currentDatetime);
};

const getDateRangeYear = () => {
  const day = 3600 * 1000 * 24;
  const currentDatetime = getCurrentDatetime();
  return {
    currentDate: formatDate(new Date(currentDatetime)),
    yearLaterDate: formatDate(new Date(currentDatetime + day * 365)),
    currentDateKR: formatDateKR(new Date(currentDatetime)),
  };
};

export { getCurrentDatetime, getYearRangeFromCurrent, getDateRangeYear };
