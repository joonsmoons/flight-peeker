import Bottleneck from "bottleneck";

const cities = [
  "TAG",
  "CJU",
  "HEL",
  "FUK",
  "CMB",
  "OKA",
  "BCN",
  "KHH",
  "CKG",
  "SYD",
  "MUC",
  "FRA",
  "CRK",
  "NYC",
  "TLV",
  "JKT",
  "PQC",
  "VTE",
  "ULN",
  "NKG",
  "RUH",
  "CTU",
  "MSP",
  "LON",
  "HKG",
  "JED",
  "BWN",
  "KLO",
  "PAR",
  "DEL",
  "SZX",
  "IST",
  "DTT",
  "HGH",
  "TAO",
  "LAX",
  "BJS",
  "YTO",
  "MIL",
  "DOH",
  "DLI",
  "SEA",
  "PUS",
  "HPH",
  "DAD",
  "NGO",
  "MNL",
  "KTM",
  "AUH",
  "CAN",
  "GUM",
  "DPS",
  "WAS",
  "ALA",
  "PRG",
  "BKK",
  "CNX",
  "LAS",
  "ATL",
  "TYO",
  "CEB",
  "SFO",
  "OSA",
  "HKT",
  "DFW",
  "ROM",
  "TAS",
  "PDX",
  "BUD",
  "DXB",
  "AKL",
  "VIE",
  "WAW",
  "SIN",
  "NHA",
  "SHA",
  "YVR",
  "BOS",
  "TPE",
  "HNL",
  "RGN",
  "MEX",
  "SGN",
  "SPN",
  "SPK",
  "BKI",
  "BNE",
  "ADD",
  "CHI",
  "PNH",
  "KUL",
  "AMS",
  "WUH",
  "HAN",
];

const features = [
  "flyFrom",
  "flyTo",
  "cityFrom",
  "cityCodeFrom",
  "cityTo",
  "cityCodeTo",
  "countryFrom",
  "countryTo",
  "distance",
  "airlines",
  "price",
  "conversion",
  "local_arrival",
  "utc_arrival",
  "local_departure",
  "utc_departure",
  "createdAt",
  "modifiedAt",
];

const getFeatures = () => features;
const getCities = () => cities;
const limiter = new Bottleneck({
  reservoir: 4, // initial value
  reservoirRefreshAmount: 4,
  reservoirRefreshInterval: 90 * 1000, // must be divisible by 250
  maxConcurrent: 4,
  minTime: 333,
});
function formatMS(ms) {
  let seconds = ms / 1000;
  const hours = parseInt(seconds / 3600);
  seconds = seconds % 3600;
  const minutes = parseInt(seconds / 60);
  seconds = seconds % 60;
  seconds = Math.round(seconds * 100) / 100;
  return `${hours}:${minutes}:${seconds}`;
}

export { getCities, getFeatures, limiter, formatMS };
