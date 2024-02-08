const mongoose = require("mongoose")

const schema = mongoose.Schema({
  // TODO: Add day (Date), city (String), state(String), country (String), temperature (Number), and condition (String).
  date: Date,
  city: String,
  state: String,
  country: String,
  temperature: Number,
  condition: String
})

module.exports = mongoose.model("WeatherStatus", schema)