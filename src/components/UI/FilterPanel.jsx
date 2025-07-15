import React from 'react'
import { FaFilter } from "react-icons/fa6";
import { BsBookmarkPlusFill } from "react-icons/bs";



const FilterPanel = ({ onFilterChange, filters }) => {
  const genres = ['All', 'Action', 'Drama', 'Sci-Fi', 'Crime', 'Thriller'];
  const years = ['All', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2010s', '2000s', '1990s'];
  const ratings = ['All', '9.0+', '8.0+', '7.0+', '6.0+'];

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center space-x-2">
        <FaFilter className="w-4 h-4 text-[#a0aec0]" />
        <span className="text-[#f0f0f0] text-sm">Filters:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <select
          onChange={(e) => onFilterChange('genre', e.target.value)}
          value={filters.genre}
          className="bg-[#1a1a1a] text-[#f0f0f0] border border-gray-600 rounded px-3 py-1 text-sm focus:border-[#0ff0fc] focus:outline-none"
        >
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>

        <select
          onChange={(e) => onFilterChange('year', e.target.value)}
          value={filters.year}
          className="bg-[#1a1a1a] text-[#f0f0f0] border border-gray-600 rounded px-3 py-1 text-sm focus:border-[#0ff0fc] focus:outline-none"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          onChange={(e) => onFilterChange('rating', e.target.value)}
          value={filters.rating}
          className="bg-[#1a1a1a] text-[#f0f0f0] border border-gray-600 rounded px-3 py-1 text-sm focus:border-[#0ff0fc] focus:outline-none"
        >
          {ratings.map(rating => (
            <option key={rating} value={rating}>{rating}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterPanel