import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MovieCard from '../components/UI/MovieCard';
import { searchMovies, discoverMovies, getGenres, getMovieDetails } from '../services/api';
import Navbar from '../components/UI/Navbar';
import RatingStars from '../components/UI/RatingStars';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    rating: '',
    year: '',
    sortBy: 'popularity.desc',
    genre: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const query = searchParams.get('query');

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

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getGenres();
        setGenres(genreData.genres || []);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch search results when query or filters change
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        
        if (!query || query.trim() === '') {
          navigate('/');
          return;
        }
        
        let results;
        if (filters.rating || filters.year || filters.genre || filters.sortBy !== 'popularity.desc') {
          // Use discover endpoint with filters
          results = await discoverMovies({
            query,
            with_genres: filters.genre,
            'vote_average.gte': filters.rating,
            primary_release_year: filters.year,
            sort_by: filters.sortBy,
            page: currentPage
          });
        } else {
          // Use regular search endpoint
          results = await searchMovies(query, currentPage);
        }
        
        if (!results || !results.results) {
          throw new Error('Invalid API response');
        }
        
        const transformedResults = results.results.map(movie => ({
          id: movie.id,
          title: movie.title,
          year: movie.release_date?.split('-')[0] || 'N/A',
          genre: movie.genre_ids?.map(id => 
            genres.find(g => g.id === id)?.name
          ).filter(Boolean).join(', ') || 'N/A',
          rating: movie.vote_average,
          poster: movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Poster',
          overview: movie.overview,
        }));
        
        setSearchResults(transformedResults);
        setTotalPages(results.total_pages || 1);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load search results');
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, navigate, filters, currentPage, genres]);

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      rating: '',
      year: '',
      sortBy: 'popularity.desc',
      genre: '',
    });
    setCurrentPage(1);
  };

  if (loading && !selectedMovie) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#0ff0fc] text-xl">
          {query ? `Searching for "${query}"...` : 'Loading...'}
        </div>
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
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#f0f0f0] mb-4 text-center">
          Search Results for "{query}"
        </h1>
        
        {/* Filters Section */}
        <div className="bg-[#1a1a1a] rounded-lg p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Rating Filter */}
            <div>
              <label className="block text-[#a0aec0] text-sm mb-1">Minimum Rating</label>
              <select
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="w-full bg-[#2d2d2d] text-[#f0f0f0] border border-gray-600 rounded px-3 py-2"
              >
                <option value="">Any Rating</option>
                <option value="7">7+</option>
                <option value="8">8+</option>
                <option value="9">9+</option>
              </select>
            </div>
            
            {/* Year Filter */}
            <div>
              <label className="block text-[#a0aec0] text-sm mb-1">Release Year</label>
              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="w-full bg-[#2d2d2d] text-[#f0f0f0] border border-gray-600 rounded px-3 py-2"
              >
                <option value="">Any Year</option>
                {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            {/* Genre Filter */}
            <div>
              <label className="block text-[#a0aec0] text-sm mb-1">Genre</label>
              <select
                name="genre"
                value={filters.genre}
                onChange={handleFilterChange}
                className="w-full bg-[#2d2d2d] text-[#f0f0f0] border border-gray-600 rounded px-3 py-2"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
              </select>
            </div>
            
            {/* Sort By */}
            <div>
              <label className="block text-[#a0aec0] text-sm mb-1">Sort By</label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full bg-[#2d2d2d] text-[#f0f0f0] border border-gray-600 rounded px-3 py-2"
              >
                <option value="popularity.desc">Popularity</option>
                <option value="vote_average.desc">Rating</option>
                <option value="primary_release_date.desc">Newest First</option>
                <option value="primary_release_date.asc">Oldest First</option>
              </select>
            </div>
            
            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full bg-[#0ff0fc] text-black px-4 py-2 rounded font-medium hover:bg-[#0dd4d9] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Results */}
        {searchResults.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {searchResults.map((movie) => (
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
            
            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 bg-primary hover:bg-primary/80 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 mx-1 text-primary">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 mx-1 bg-primary hover:bg-primary/80 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl text-[#f0f0f0] mb-4">No results found for "{query}"</h2>
            <p className="text-[#a0aec0]">Try adjusting your filters or using a different search term</p>
          </div>
        )}

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

export default SearchResults;