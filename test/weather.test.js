const chai = require("chai");
const {expect} = chai;
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const app = require("../src/app");
const dotenv = require('dotenv').config();
const WeatherStatus = require("../src/weather/weather.model")

chai.use(chaiHttp);
mongoose.Promise = global.Promise;

const database_url = process.env.DATABASE_URL || "mongodb://localhost/test";

describe("/weather", () => {
  beforeEach(() =>
    mongoose.connect(
      database_url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
  );

  afterEach(done => {
    mongoose.connection.db.dropDatabase(() =>
      mongoose.connection.close(done)
    )
  });
  //after(() => mongoose.disconnect());

  it("GET /weather - should return an array of all weather status", async () => {
    await new WeatherStatus({ date: "2022-08-09", city: "San Antonio", state: "Texas", country: "United States of America", temperature: 90, condition: "Sunny" }).save();
    return chai.request(app)
      .get("/weather")
      .then(res => {
        console.log(res.body);
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");
        expect(res.body[0].date).to.match(/^2022-08-09/);
        expect(res.body[0].city).to.equal("San Antonio");
        expect(res.body[0].state).to.equal("Texas");
        expect(res.body[0].country).to.equal("United States of America");
        expect(res.body[0].temperature).to.equal(90);
        expect(res.body[0].condition).to.equal("Sunny");
      });
  });
  
  it("GET /weather/:weatherStatusId - should return the weather status given the id", async () => {
    const newWeatherStatus = new WeatherStatus({ date: "2022-08-09", city: "San Antonio", state: "Texas", country: "United States of America", temperature: 90, condition: "Sunny" });
    await newWeatherStatus.save();
    const weatherStatusId = newWeatherStatus._id;
    return chai.request(app)
      .get("/weather/"+weatherStatusId)
      .then(res => {
        console.log(res.body);
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body.data.date).to.match(/^2022-08-09/);
        expect(res.body.data.city).to.equal("San Antonio");
        expect(res.body.data.state).to.equal("Texas");
        expect(res.body.data.country).to.equal("United States of America");
        expect(res.body.data.temperature).to.equal(90);
        expect(res.body.data.condition).to.equal("Sunny");
      });
  });

    it("POST /weather - should add a new weather status when POST to /weather", async () => {
      return chai.request(app)
        .post("/weather")
        .set('content-type', 'application/json')
        .send({data: { date: "2022-08-10", city: "San Antonio", state: "Texas", country: "United States of America", temperature: 90, condition: "Sunny" }})
        .then(res => {
          console.log(res.body);
          expect(res.status).to.equal(201);
          expect(res).to.be.json;
          expect(res.body.data.date).to.match(/^2022-08-10/);
          expect(res.body.data.city).to.equal("San Antonio");
        });
    });
  
  
  it("PUT /weather/:weatherStatusId - should update the weather status given the id", async () => {
    const newWeatherStatus = new WeatherStatus({ date: "2022-08-09", city: "San Antonio", state: "Texas", country: "United States of America", temperature: 90, condition: "Sunny" });
    await newWeatherStatus.save();
    const weatherStatusId = newWeatherStatus._id;
    return chai.request(app)
      .put("/weather/"+weatherStatusId)
      .set('content-type', 'application/json')
      .send({data: { date: "2022-08-10", city: "San Diego", state: "California", country: "United States of America", temperature: 80, condition: "Sunny" }})
      .then(res => {
        console.log(res.body);
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body.data.date).to.match(/^2022-08-10/);
        expect(res.body.data.city).to.equal("San Diego");
        expect(res.body.data.state).to.equal("California");
        expect(res.body.data.country).to.equal("United States of America");
        expect(res.body.data.temperature).to.equal(80);
        expect(res.body.data.condition).to.equal("Sunny");
      });
  });
  
  it("DELETE /weather/:weatherStatusId - should delete the weather status given the id", async () => {
    const newWeatherStatus = new WeatherStatus({ date: "2022-08-09", city: "San Antonio", state: "Texas", country: "United States of America", temperature: 90, condition: "Sunny" });
    await newWeatherStatus.save();
    const weatherStatusId = newWeatherStatus._id;
    return chai.request(app)
      .delete("/weather/"+weatherStatusId)
      .then(res => {
        console.log(res.body);
        expect(res.status).to.equal(204);
      });
  });
});
