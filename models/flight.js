import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
  flyFrom: { type: String, uppercase: true },
  flyTo: { type: String, uppercase: true },
  cityFrom: { type: String },
  cityCodeFrom: { type: String, uppercase: true },
  cityTo: { type: String },
  cityCodeTo: { type: String, uppercase: true },
  countryFrom: {
    code: { type: String, uppercase: true },
    name: { type: String },
  },
  countryTo: {
    code: { type: String, uppercase: true },
    name: { type: String },
  },
  distance: { type: Number },
  airlines: [String],
  price: { type: Number },
  conversion: {
    EUR: { type: Number },
    KRW: { type: Number },
  },
  local_arrival: { type: Date },
  utc_arrival: { type: Date },
  local_departure: { type: Date },
  utc_departure: { type: Date },
  isTest: { type: Number },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  dt: { type: String },
});

const Flight = mongoose.model("Flight", flightSchema);

export default Flight;
