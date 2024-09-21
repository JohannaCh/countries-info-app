require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3008;

app.use(cors());
//GET all countries
app.get("/countries", async (_, res) => {
  try {
    const countriesResponse = await axios.get(
      `${process.env.COUNTRIES_API_BASE_URL}/AvailableCountries`
    );
    res.status(200).json(countriesResponse.data);
  } catch (error) {
    res.status(400).json({ error, message: "No countries found" });
  }
});

// GET specific country info
app.get("/country/:id", async (req, res) => {
  const countryCode = req.params.id;
  try {
    // borders countries
    const bordersResponse = await axios.get(
      `${process.env.COUNTRIES_API_BASE_URL}/CountryInfo/${countryCode}`
    );
    const bordersCountries = bordersResponse.data.borders;
    const currentCountry = bordersResponse.data.commonName;

    // population Data
    const populationResponse = await axios.post(
      `${process.env.COUNTRIES_DATA_API_BASE_URL}/population`,
      {
        country: currentCountry,
      }
    );
    const populationData = populationResponse.data;

    //flag Url
    const flagResponse = await axios.post(
      `${process.env.COUNTRIES_DATA_API_BASE_URL}/flag/images`,
      {
        country: currentCountry,
      }
    );
    const flagUrl = flagResponse.data.data.flag;

    // response obj
    const countryInfo = {
      borders: bordersCountries,
      population: populationData,
      flag: flagUrl,
    };

    res.status(200).json(countryInfo);
  } catch (error) {
    res.status(400).json({ message: "Country not found", error });
  }
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
