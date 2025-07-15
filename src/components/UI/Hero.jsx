import React, { useState, useEffect } from 'react';
import { getPopularMovies } from '../../services/api';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Hero = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await getPopularMovies(1);
        const popularMovies = response.results.slice(0, 5); // Get top 5 popular movies
        setMovies(popularMovies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching popular movies:', error);
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === movies.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [movies.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <div className="h-96 bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#0ff0fc] text-xl">Loading featured movies...</div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="h-96 bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#ff1744] text-xl">No featured movies available</div>
      </div>
    );
  }

  return (
    <div className="relative h-96 w-full overflow-hidden bg-[#0a0a0a]">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {movies.map((movie) => (
          <div 
            key={movie.id} 
            className="w-full flex-shrink-0 relative h-96"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent z-10"></div>
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-screen object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/1920x1080?text=No+Backdrop';
              }}
            />
            <div className="absolute bottom-0 left-0 z-20 p-8 max-w-2xl">
              <h2 className="text-4xl font-bold text-[#f0f0f0] mb-2">
                {movie.title}
              </h2>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-[#0ff0fc]">
                  {movie.release_date?.split('-')[0] || 'N/A'}
                </span>
                <span className="text-[#39ff14]">
                  Rating: {movie.vote_average?.toFixed(1)}/10
                </span>
              </div>
              <p className="text-[#a0aec0] line-clamp-3">
                {movie.overview}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-[#f0f0f0] hover:bg-[#0ff0fc] hover:text-black transition-colors"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-[#f0f0f0] hover:bg-[#0ff0fc] hover:text-black transition-colors"
        aria-label="Next slide"
      >
        <FaChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-[#0ff0fc]' : 'bg-[#a0aec0]'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;