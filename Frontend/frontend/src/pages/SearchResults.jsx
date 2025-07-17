import React from "react";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Search Results for: <span className="text-blue-600">{query}</span>
      </h2>
      {/* Replace this with actual search logic */}
      <p className="text-gray-600">Search functionality coming soon...</p>
    </div>
  );
};

export default SearchResults;
