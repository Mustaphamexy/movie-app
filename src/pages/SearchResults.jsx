import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MovieCard from '../components/UI/MovieCard';
import { searchMovies } from '../services/api';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const query = searchParams.get('query');
  console.log('Query from useSearchParams:', query);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        
        if (!query || query.trim() === '') {
          console.log('No valid query, navigating to home');
          navigate('/');
          return;
        }
        
        console.log('Fetching results for query:', query);
        const results = await searchMovies(query);
        
        if (!results || !results.results) {
          throw new Error('Invalid API response');
        }
        
        const transformedResults = results.results.map(movie => ({
          id: movie.id,
          title: movie.title,
          year: movie.release_date?.split('-')[0] || 'N/A',
          genre: movie.genre_ids?.join(', ') || 'N/A',
          rating: movie.vote_average,
          poster: movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Poster',
          overview: movie.overview,
        }));
        
        setSearchResults(transformedResults);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load search results');
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, navigate]);

  if (loading) {
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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#f0f0f0] mb-8 text-center">
          Search Results for "{query}"
        </h1>
        
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {searchResults.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl text-[#f0f0f0] mb-4">No results found for "{query}"</h2>
            <p className="text-[#a0aec0]">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;