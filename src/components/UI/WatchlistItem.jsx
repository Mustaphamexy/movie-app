import React from 'react'
import MovieCard from './MovieCard';
import { BookmarkPlus } from 'react-icons/bs';


const WatchlistItem = ({ movies, onMovieClick, onRemoveFromWatchlist }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-[#f0f0f0] text-2xl font-bold">My Watchlist</h2>
      {movies.length === 0 ? (
        <div className="text-center py-12">
          <BookmarkPlus className="w-16 h-16 text-[#a0aec0] mx-auto mb-4" />
          <p className="text-[#a0aec0] text-lg">Your watchlist is empty</p>
          <p className="text-[#a0aec0] text-sm">Add movies you want to watch later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onMovieClick={onMovieClick}
              onWatchlistToggle={onRemoveFromWatchlist}
              onFavoriteToggle={() => {}}
              isInWatchlist={true}
              isInFavorites={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistItem