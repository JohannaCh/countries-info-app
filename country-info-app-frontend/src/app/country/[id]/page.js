"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";
import Link from "next/link";

Chart.register(CategoryScale, LinearScale, BarElement);

const CountryInfo = ({ params }) => {
  const { id } = params;
  const [countryInfo, setCountryInfo] = useState(null);
  const [populationData, setPopulationData] = useState([]);

  useEffect(() => {
    const fetchCountryInfo = async () => {
      try {
        if (!id) return;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/country/${id}`
        );
        setCountryInfo(response.data);
        setPopulationData(response.data.population.data.populationCounts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCountryInfo();
  }, [id]);

  if (!countryInfo) return <div>Loading...</div>;

  const chartData = {
    labels: populationData.map((data) => data.year),
    datasets: [
      {
        label: "Population",
        data: populationData.map((data) => data.value),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };
  return (
    <div style={{ padding: "20px" }}>
      <div className="flex items-center gap-x-4 p-6">
        <img
          src={countryInfo.flag}
          alt={`${countryInfo.name} flag`}
          className="w-20 h-auto"
        />
        <h1 className="text-4xl font-bold mb-6">
          {countryInfo.population.data.country}
        </h1>
      </div>
      <div className="flex">
        <div className="w-1/2 p-2">
          <h1 className="text-2xl font-bold mb-6">Historical Population</h1>
          <Bar data={chartData} />
        </div>
        <div className="w-1/2 p-2">
          <h1 className="text-2xl font-bold mb-6">Border Countries</h1>
          <ul>
            {countryInfo.borders.map((borderCountry) => (
              <li key={borderCountry.countryCode}>
                <Link
                  href={`/country/${String(borderCountry.countryCode)}`}
                  className="block p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
                >
                  {borderCountry.commonName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CountryInfo;
