"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const Home = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const getCountries = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/countries`
        );
        setCountries(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCountries();
  }, []);

  if (!countries) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Country List</h1>
      <div div className="max-h-96 overflow-y-scroll">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((country) => (
            <Link
              href={`/country/${country.countryCode}`}
              className="block p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              {country.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
