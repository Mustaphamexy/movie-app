import { Link, useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import { logo } from "../Details";
import { AuthContext } from "../../context/AuthContext";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    if (query && query.trim() !== '') {
      const trimmedQuery = query.trim();
      const encodedQuery = encodeURIComponent(trimmedQuery);
      navigate(`/search?query=${encodedQuery}`);
    }
  };

  return (
    <div className="bg-[#0a0a0a] text-[#f0f0f0]">
      <nav className="p-4 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
        {/* Top row for logo and auth buttons */}
        <div className="w-full flex justify-between items-center mb-4 md:mb-0">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="MovieApp Logo" className="h-12" />
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
        </div>
        
        {/* Bottom row for search bar - full width on mobile, aligned under logo on desktop */}
        <div className="w-full md:w-auto md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:top-4 mt-4 md:mt-0">
          <SearchBar onSearch={handleSearch} placeholder="Search movies..." />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;