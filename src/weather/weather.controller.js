const WeatherStatus = require("./weather.model")

async function list(req, res) {
  // TODO: Task 2 - GET /weather - list all the weather documents.
  const weatherStatus = await WeatherStatus.find()
  res.send(weatherStatus);
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({
        status: 400,
        message: `Must include a ${propertyName}`
    });
  };
}

async function create(req, res) {
  // TODO: Task 3 POST /weather - add a new weather status.
  const { data: { date, city, state, country, temperature, condition } = {} } = req.body;
  const newWeatherStatus = new WeatherStatus({
      date: date,
      city: city,
      state: state,
      country: country,
      temperature: temperature,
      condition: condition
  })
  await newWeatherStatus.save()
  res.status(201).json({ data: newWeatherStatus });
}

async function weatherStatusExists(req, res, next) {
  const { weatherStatusId } = req.params;
  const foundWeatherStatus = await WeatherStatus.findOne({"_id":weatherStatusId});
  if (foundWeatherStatus) {
    res.locals.weatherStatus = foundWeatherStatus;
    return next();
  }
  next({
    status: 404,
    message: `Weather Status id not found: ${weatherStatusId}`,
  });
};

function read(req, res, next) {
  //TODO: Task 4 GET /weather/:weatherStatusId - get the weather status with a specific id.
  res.json({ data: res.locals.weatherStatus });
}

async function update(req, res) {
  // TODO: Task 5 PUT /weather/:weatherStatusId - update the weather status with a specific id.
  const weatherStatus = res.locals.weatherStatus;
  const { data: { date, city, state, country, temperature, condition } = {} } = req.body;

  weatherStatus.date = date;
  weatherStatus.city = city;
  weatherStatus.state = state;
  weatherStatus.country = country;
  weatherStatus.temperature = temperature;
  weatherStatus.condition = condition;
  await weatherStatus.save();

  res.json({ data: weatherStatus });
}

async function destroy(req, res) {
  // TODO: Task 6 DELETE /weather/:weatherStatusId - delete the weather status with a specific id.
  const { weatherStatusId } = req.params;
  await WeatherStatus.deleteOne({ _id: weatherStatusId })
  res.sendStatus(204);
}

module.exports = {
  list,
  create: [
      bodyDataHas("date"),
      bodyDataHas("city"),
      bodyDataHas("state"),
      bodyDataHas("country"),
      bodyDataHas("temperature"),
      bodyDataHas("condition"),
      create
  ],
  read: [weatherStatusExists, read],
  update: [
      weatherStatusExists,
      bodyDataHas("date"),
      bodyDataHas("city"),
      bodyDataHas("state"),
      bodyDataHas("country"),
      bodyDataHas("temperature"),
      bodyDataHas("condition"),
      update
  ],
  delete: [weatherStatusExists, destroy],
};