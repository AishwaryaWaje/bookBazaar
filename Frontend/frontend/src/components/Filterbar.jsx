import { React, useEffect, useState } from "react";
import axios from "axios";

const FiltersBar = ({ filters, setFilters }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books/genres");
        setGenres(res.data);
      } catch (err) {
        console.error("Failed to fetch genres", err);
      }
    };
    fetchGenres();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    let minPrice = "",
      maxPrice = "";

    switch (value) {
      case "0-199":
        minPrice = 0;
        maxPrice = 199;
        break;
      case "200-299":
        minPrice = 200;
        maxPrice = 299;
        break;
      case "300-499":
        minPrice = 300;
        maxPrice = 499;
        break;
      case "500-699":
        minPrice = 500;
        maxPrice = 699;
        break;
      case "700-999":
        minPrice = 700;
        maxPrice = 999;
        break;
      case "1000+":
        minPrice = 1000;
        maxPrice = "";
        break;
      default:
        minPrice = "";
        maxPrice = "";
    }

    setFilters((prev) => ({ ...prev, minPrice, maxPrice }));
  };

  return (
    <div className="sticky top-[52px] z-40 bg-white shadow-md h-12 flex items-center gap-3 w-full px-4">
      <select
        name="genere"
        value={filters.genere}
        onChange={handleChange}
        className="border px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="">All Genres</option>
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      {/* Condition Filter */}
      <select
        name="condition"
        value={filters.condition}
        onChange={handleChange}
        className="border px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="">All Conditions</option>
        <option value="Brand New">Brand New</option>
        <option value="Like New">Like New</option>
        <option value="Good">Good</option>
        <option value="Acceptable">Acceptable</option>
        <option value="Worn">Worn</option>
        <option value="Damaged">Damaged</option>
      </select>

      {/* Price Filter */}
      <select
        name="priceRange"
        onChange={handlePriceChange}
        className="border px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={
          filters.minPrice === "" && filters.maxPrice === ""
            ? ""
            : filters.maxPrice === ""
            ? "1000+"
            : `${filters.minPrice}-${filters.maxPrice}`
        }>
        <option value="">All Prices</option>
        <option value="0-199">₹199 and below</option>
        <option value="200-299">₹200 - ₹299</option>
        <option value="300-499">₹300 - ₹499</option>
        <option value="500-699">₹500 - ₹699</option>
        <option value="700-999">₹700 - ₹999</option>
        <option value="1000+">₹1000 and above</option>
      </select>
    </div>
  );
};

export default FiltersBar;
