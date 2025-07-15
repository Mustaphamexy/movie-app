import { Link, useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import { logo } from "../Details";
import { AuthContext } from "../../context/AuthContext";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    console.log('Search initiated with query:', query);
    console.log('Query type:', typeof query);
    console.log('Query length:', query?.length);
    
    if (query && query.trim() !== '') {
      const trimmedQuery = query.trim();
      const encodedQuery = encodeURIComponent(trimmedQuery);
      const searchUrl = `/search?query=${encodedQuery}`;
      
      console.log('Trimmed query:', trimmedQuery);
      console.log('Encoded query:', encodedQuery);
      console.log('Final URL:', searchUrl);
      
      navigate(searchUrl);
    } else {
      console.log('Invalid query - not navigating');
    }
  };

  return (
    <nav className="p-4 flex justify-between items-center bg-[#0a0a0a] text-[#f0f0f0]">
      <Link to="/" className="flex items-center space-x-4">
        <img src={logo} alt="MovieApp Logo" className="h-12" />
        <SearchBar onSearch={handleSearch} placeholder="Search movies..." />
      </Link>
      <div className="space-x-4 flex items-center">
        {user ? (
          <Link 
            to="/dashboard" 
            className="bg-[#0ff0fc] text-black px-4 py-2 rounded font-medium hover:bg-[#0dd4d9] transition-colors"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link 
              to="/login" 
              className="bg-[#1a1a1a] border border-[#0ff0fc] text-[#0ff0fc] px-4 py-2 rounded font-medium hover:bg-[#0ff0fc]/10 transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-[#0ff0fc] text-black px-4 py-2 rounded font-medium hover:bg-[#0dd4d9] transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;