import mongoose from "mongoose";
import Flight from "./models/flight.js";
import getFlights from "./getFlights.js";
import express from "express";
import { getDateRangeYear } from "./date.js";
import methodOverride from "method-override";

const app = express();

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}
const password = process.argv[2];

// paid
const url = `mongodb+srv://joonsmoons:${password}@serverlessinstance0.iwp32.mongodb.net/ods?retryWrites=true&w=majority`;

//free
// const url = `mongodb+srv://joonsmoons:${password}@cluster0.ljzeutv.mongodb.net/ods?retryWrites=true&w=majority`;

mongoose
  .connect(url)
  .then(() => {
    console.log("[OK] MONGO CONNECTION OPEN!");
  })
  .catch((err) => {
    console.log("[ERROR] MONGO CONNECTION ERROR!");
    console.log(err.message);
  });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/flights", async (req, res) => {
  // const flights = await Flight.find({});
  // const flightStats = await Flight.aggregate([
  //   { $group: { _id: "$dt", count: { $sum: 1 } } },
  // ]); // cost is too high
  // console.log(flightStats);
  res.render("flights/index"); // { flightStats }
});

// create : for today's date, replace if exists
app.get("/flights/new", async (req, res) => {
  res.render("flights/new");
});

app.post("/flights", async (req, res) => {
  const dateRange = getDateRangeYear();
  await Flight.collection.deleteMany({ dt: dateRange["currentDateKR"] });

  const flights = await getFlights();
  console.log(`Inserting into database count: ${flights.length}`);
  await Flight.collection
    .insertMany(flights)
    .then(() => {
      res.redirect("/flights");
    })
    .catch((err) => {
      console.error("error ", err);
      res.redirect("/flights");
    });
});

// read : for today's date

app.listen(3000, () => {
  console.log("APP IS LISTENING ON PORT 3000");
});
