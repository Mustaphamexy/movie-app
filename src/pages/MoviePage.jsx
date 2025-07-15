import React, { useState, useEffect } from 'react';
import MovieCard from '../components/UI/MovieCard';
import { 
  getPopularMovies, 
  getTopRatedMovies, 
  getUpcomingMovies, 
  getMovieDetails 
} from '../services/api';
import RatingStars from '../components/UI/RatingStars';

const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('popular');

  // Load watchlist and favorites from localStorage
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    const savedFavorites = localStorage.getItem('favorites');
    
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  // Save to localStorage when watchlist or favorites change
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Fetch movies based on category and page
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        let response;
        
        switch(selectedCategory) {
          case 'popular':
            response = await getPopularMovies(currentPage);
            break;
          case 'top-rated':
            response = await getTopRatedMovies(currentPage);
            break;
          case 'upcoming':
            response = await getUpcomingMovies(currentPage);
            break;
          default:
            response = await getPopularMovies(currentPage);
        }

        const transformedMovies = response.results.map(movie => ({
          id: movie.id,
          title: movie.title,
          year: movie.release_date?.split('-')[0] || 'N/A',
          genre: movie.genre_ids.join(', '),
          rating: movie.vote_average,
          poster: movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Poster',
          overview: movie.overview,
        }));

        setMovies(transformedMovies);
        setTotalPages(response.total_pages);
        setLoading(false);
      } catch (err) {
        setError('Failed to load movies data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchMovies();
  }, [currentPage, selectedCategory]);

  const handleMovieClick = async (movie) => {
    try {
      setLoading(true);
      const details = await getMovieDetails(movie.id);
      
      const director = details.credits?.crew?.find(
        person => person.job === 'Director'
      )?.name || 'Unknown';

      const cast = details.credits?.cast
        ?.slice(0, 5)
        .map(actor => actor.name) || [];

      const genres = details.genres?.map(genre => genre.name).join(', ') || 'N/A';

      setSelectedMovie({
        ...movie,
        director,
        cast,
        genres,
        runtime: details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : 'N/A',
        backdrop: details.backdrop_path 
          ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
          : 'https://via.placeholder.com/1920x1080?text=No+Backdrop',
        budget: details.budget ? `$${details.budget.toLocaleString()}` : 'N/A',
        revenue: details.revenue ? `$${details.revenue.toLocaleString()}` : 'N/A',
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load movie details');
      setLoading(false);
      console.error(err);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const handleWatchlistToggle = (movieId) => {
    setWatchlist(prev => 
      prev.includes(movieId) 
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  const handleFavoriteToggle = (movieId) => {
    setFavorites(prev => 
      prev.includes(movieId) 
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderCategorySelector = () => {
    const categories = [
      { value: 'popular', label: 'Popular' },
      { value: 'top-rated', label: 'Top Rated' },
      { value: 'upcoming', label: 'Upcoming' }
    ];

    return (
      <div className="flex justify-center mb-8">
        <div className="bg-[#1a1a1a] rounded-lg p-1">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-[#0ff0fc] text-[#0a0a0a]'
                  : 'text-[#a0aec0] hover:text-[#f0f0f0]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === 1
              ? 'bg-[#2a2a2a] text-[#666] cursor-not-allowed'
              : 'bg-[#1a1a1a] text-[#a0aec0] hover:text-[#f0f0f0] hover:bg-[#2a2a2a]'
          }`}
        >
          Previous
        </button>
        
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-[#0ff0fc] text-[#0a0a0a]'
                : 'bg-[#1a1a1a] text-[#a0aec0] hover:text-[#f0f0f0] hover:bg-[#2a2a2a]'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === totalPages
              ? 'bg-[#2a2a2a] text-[#666] cursor-not-allowed'
              : 'bg-[#1a1a1a] text-[#a0aec0] hover:text-[#f0f0f0] hover:bg-[#2a2a2a]'
            }`}
        >
          Next
        </button>
      </div>
    );
  };

  if (loading && !selectedMovie) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#0ff0fc] text-xl">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#ff1744] text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        

        {renderCategorySelector()}
        
        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onMovieClick={handleMovieClick}
              onWatchlistToggle={handleWatchlistToggle}
              onFavoriteToggle={handleFavoriteToggle}
              isInWatchlist={watchlist.includes(movie.id)}
              isInFavorites={favorites.includes(movie.id)}
            />
          ))}
        </div>

        {renderPagination()}
        
        {/* Movie Detail Modal */}
        {selectedMovie && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-[#a0aec0] hover:text-[#f0f0f0] text-2xl z-10"
                >
                  ×
                </button>
                <div className="relative h-64 w-full">
                  <img 
                    src={selectedMovie.backdrop} 
                    alt={selectedMovie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/1920x1080?text=No+Backdrop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-end">
                    <img 
                      src={selectedMovie.poster} 
                      alt={selectedMovie.title}
                      className="w-24 h-36 object-cover rounded shadow-lg mr-4"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
                      }}
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-[#f0f0f0]">
                        {selectedMovie.title} ({selectedMovie.year})
                      </h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <RatingStars rating={Math.round(selectedMovie.rating / 2)} />
                        <span className="text-[#f0f0f0]">{selectedMovie.rating.toFixed(1)}/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold text-[#f0f0f0] mb-4">Overview</h3>
                    <p className="text-[#a0aec0]">
                      {selectedMovie.overview || 'No overview available.'}
                    </p>
                    
                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-[#f0f0f0] mb-4">Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[#0ff0fc]">Director</p>
                          <p className="text-[#a0aec0]">{selectedMovie.director}</p>
                        </div>
                        <div>
                          <p className="text-[#0ff0fc]">Runtime</p>
                          <p className="text-[#a0aec0]">{selectedMovie.runtime}</p>
                        </div>
                        <div>
                          <p className="text-[#0ff0fc]">Budget</p>
                          <p className="text-[#a0aec0]">{selectedMovie.budget}</p>
                        </div>
                        <div>
                          <p className="text-[#0ff0fc]">Revenue</p>
                          <p className="text-[#a0aec0]">{selectedMovie.revenue}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-[#f0f0f0] mb-4">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMovie.genres.split(', ').map((genre, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-[#0ff0fc]/10 text-[#0ff0fc] rounded-full text-sm"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-bold text-[#f0f0f0] mt-6 mb-4">Cast</h3>
                    <ul className="space-y-2 text-[#a0aec0]">
                      {selectedMovie.cast.map((actor, index) => (
                        <li key={index}>{actor}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviePage;