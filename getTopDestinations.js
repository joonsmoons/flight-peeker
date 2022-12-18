const axios = require("axios");

const TEQUILA_ENDPOINT =
  "https://api.tequila.kiwi.com/locations/topdestinations";
const HEADER = {
  apikey: "3KFBHv6kxevd4ycmgFF8oGgQYEYRIU4e",
  "Content-Type": "application/json",
};
const FEATURES = [
  "id",
  "active",
  "name",
  "code",
  "rank",
  "global_rank_dst",
  "dst_popularity_score",
  "airports",
  "country",
  "region",
  "continent",
  "location",
];

const getData = (params, features) => {
  return axios
    .get(TEQUILA_ENDPOINT, { params: params, headers: HEADER })
    .then((response) => response.data)
    .then((data) => {
      const locations = data.locations;
      console.log(`[SUCCESS] Getting ${locations.length} rows...`);
      return locations.map((location) => {
        return features.reduce((ret, key) => {
          if (key in location) ret[key] = location[key];
          return ret;
        }, {});
      });
    })
    .catch((error) => {
      console.log("[ERROR] Retrieval failed");
      console.log(error.message);
    });
};

const getAllOneDate = async () => {
  const PARAMS = {
    term: "seoul_kr",
    limit: 50,
    sort: "dst_popularity_score",
    source_popularity: "bookings",
  };
  const resData = await getData(PARAMS, FEATURES);

  console.log(resData);
};

// getAllOneDate();
