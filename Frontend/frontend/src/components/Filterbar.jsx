import { React, useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
/**
 * @typedef {object} FilterState
 * @property {string} [genere] - The selected genre filter.
 * @property {string} [condition] - The selected condition filter.
 * @property {number|string} [minPrice] - The minimum price filter.
 * @property {number|string} [maxPrice] - The maximum price filter.
 */
/**
 * @description FiltersBar component for filtering book listings.
 * @param {object} props - React props.
 * @param {FilterState} props.filters - The current filter state.
 * @param {React.Dispatch<React.SetStateAction<FilterState>>} props.setFilters - Function to update the filter state.
 * @returns {JSX.Element} The FiltersBar component.
 */
const FiltersBar = ({ filters, setFilters }) => {
  /** @type {Array<string>} */
  const [genres, setGenres] = useState([]);

  /**
   * @description Effect hook to fetch available genres from the API on component mount.
   */
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(`${API}/api/books/genres`);
        setGenres(res.data);
      } catch (err) {
        console.error("Failed to fetch genres", err);
      }
    };
    fetchGenres();
  }, []);

  /**
   * @description Handles changes in the genre and condition select inputs.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The event object.
   * @returns {void}
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * @description Handles changes in the price range select input.
   * Updates `minPrice` and `maxPrice` in the filter state based on the selected range.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The event object.
   * @returns {void}
   */
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
