import axios from "axios";
import axiosRetry from "axios-retry";
import { getCities, getFeatures, limiter, formatMS } from "./utilities.js";
import { getCurrentDatetime, getDateRangeYear } from "./date.js";
import fs from "fs";

axiosRetry(axios, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 5000;
  },
  retryCondition: (error) => {
    return error.response.status === 503;
  },
});

const getData = (params) => {
  const TEQUILA_ENDPOINT = "https://api.tequila.kiwi.com/v2/search";
  const HEADER = {
    apikey: "3KFBHv6kxevd4ycmgFF8oGgQYEYRIU4e",
    "Content-Type": "application/json",
  };
  const features = getFeatures();

  return axios
    .get(TEQUILA_ENDPOINT, { params: params, headers: HEADER })
    .then((response) => response.data)
    .then((data) => {
      const flights = data.data;
      console.log(
        `[${new Date().toTimeString().split(" ")[0]}][SUCCESS] Getting ${
          flights.length
        } rows...`
      );
      return flights.map((flight) => {
        flight["createdAt"] = new Date(getCurrentDatetime());
        flight["modifiedAt"] = new Date(getCurrentDatetime());
        flight["local_arrival"] = new Date(Date.parse(flight["local_arrival"]));
        flight["utc_arrival"] = new Date(Date.parse(flight["utc_arrival"]));
        flight["local_departure"] = new Date(
          Date.parse(flight["local_departure"])
        );
        flight["utc_departure"] = new Date(Date.parse(flight["utc_departure"]));
        const filteredFlight = features.reduce((ret, key) => {
          if (key in flight) ret[key] = flight[key];
          return ret;
        }, {});

        return filteredFlight;
      });
    })
    .catch(async (error) => {
      console.log(
        `[${new Date().toTimeString().split(" ")[0]}][ERROR] Retrieval failed`
      );
      console.log(error.response.status);
      console.log(error.message);

      return getData(params);
    });
};

const getDataOneCity = async (city) => {
  const dateRange = getDateRangeYear();
  console.log(
    `[${
      new Date().toTimeString().split(" ")[0]
    }][STEP] Retrieving flights for ${city}...`
  );
  const paramsFrom = {
    fly_from: "city:SEL",
    fly_to: `city:${city}`,
    date_from: dateRange["currentDate"],
    date_to: dateRange["yearLaterDate"],
    flight_type: "oneway",
    one_per_date: 1,
    max_stopovers: 0,
    curr: "KRW",
    locale: "kr",
  };

  const resFromAll = await getData(paramsFrom);
  const resFromKE = await getData({ ...paramsFrom, select_airlines: "KE" });
  const resFromOZ = await getData({ ...paramsFrom, select_airlines: "OZ" });

  const paramsTo = {
    ...paramsFrom,
    fly_from: `city:${city}`,
    fly_to: "city:SEL",
  };

  const resToAll = await getData(paramsTo);
  const resToKE = await getData({ ...paramsTo, select_airlines: "KE" });
  const resToOZ = await getData({ ...paramsTo, select_airlines: "OZ" });

  const res = [
    ...resFromAll,
    ...resFromKE,
    ...resFromOZ,
    ...resToAll,
    ...resToKE,
    ...resToOZ,
  ];

  return res;
};

const getFlights = async (isTest = 0) => {
  let start = Date.now();
  const cities = getCities();
  const dateRange = getDateRangeYear();

  const throttledGetFlights = limiter.wrap(getDataOneCity);
  const allFlightPromises = cities.map((city) => {
    return throttledGetFlights(city);
  });

  try {
    const flightsArray = await Promise.all(allFlightPromises);
    let allFlights = flightsArray.flat(1);

    if (allFlights.length > 0) {
      allFlights = allFlights.map((flight) => {
        return {
          ...flight,
          isTest: isTest,
          dt: dateRange["currentDateKR"],
        };
      });

      // save into file
      const allFlightsContent = JSON.stringify(allFlights);
      fs.writeFile(
        `./data/allFlights_${dateRange["currentDate"].replace(
          /\//g,
          "-"
        )}.json`,
        allFlightsContent,
        "utf8",
        function (err) {
          if (err) {
            return console.log(err);
          }
          console.log("The file was saved!");
        }
      );
      let end = Date.now();
      let elapsed = end - start;
      console.log(`length of data: ${allFlights.length}`);
      console.log(`time elapsed: ${formatMS(elapsed)}`);

      return new Promise((resolve) => {
        resolve(allFlights);
      });
    }
  } catch (err) {
    console.log(
      `[${
        new Date().toTimeString().split(" ")[0]
      }][ERROR] Something went wrong.`
    );
    console.log(err);
    let end = Date.now();
    let elapsed = end - start;
    console.log(`time elapsed: ${formatMS(elapsed)}`);

    return new Promise((resolve) => {
      resolve([]);
    });
  }
};

export default getFlights;
// getFlights();
