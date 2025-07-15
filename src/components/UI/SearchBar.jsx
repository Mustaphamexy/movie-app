import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ placeholder = "Search movies..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1a1a1a] text-[#f0f0f0] border border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:border-[#0ff0fc] focus:outline-none"
      />
      <FaSearch className="absolute left-3 top-2.5 w-4 h-4 text-[#a0aec0]" />
      <button
        type="submit"
        className="absolute right-2 top-1.5 bg-[#0ff0fc] text-black px-3 py-1 rounded text-sm font-medium hover:bg-[#0dd4d9] transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
