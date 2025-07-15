import React from 'react'
import { FaHeart } from "react-icons/fa6";
import { BsBookmarkPlusFill } from "react-icons/bs";
import RatingStars from './RatingStars';

const MovieCard = ({ movie, onMovieClick, onWatchlistToggle, onFavoriteToggle, isInWatchlist, isInFavorites }) => {
  return (
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-[#0ff0fc]/20">
      <div className="relative">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-64 object-cover cursor-pointer"
          onClick={() => onMovieClick(movie)}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
          }}
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(movie.id);
            }}
            className={`p-2 rounded-full ${isInFavorites ? 'bg-[#ff1744] text-white' : 'bg-black/50 text-white'} hover:bg-[#ff1744] transition-colors`}
            aria-label={isInFavorites ? "Remove from favorites" : "Add to favorites"}
          >
            <FaHeart className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatchlistToggle(movie.id);
            }}
            className={`p-2 rounded-full ${isInWatchlist ? 'bg-[#0ff0fc] text-black' : 'bg-black/50 text-white'} hover:bg-[#0ff0fc] hover:text-black transition-colors`}
            aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          >
            <BsBookmarkPlusFill className="w-4 h-4" />
          </button>
        </div>
        {movie.rating > 7.5 && (
          <div className="absolute top-2 left-2 bg-[#39ff14] text-black text-xs font-bold px-2 py-1 rounded">
            TOP RATED
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 
          className="text-[#f0f0f0] font-semibold text-lg mb-2 cursor-pointer hover:text-[#0ff0fc] transition-colors line-clamp-1" 
          onClick={() => onMovieClick(movie)}
          title={movie.title}
        >
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#a0aec0] text-sm">{movie.year}</span>
          <span className="text-[#0ff0fc] text-sm font-medium">
            {movie.genres?.split(', ')[0] || 'N/A'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <RatingStars rating={Math.round(movie.rating / 2)} />
          <span className="text-[#f0f0f0] text-sm">{movie.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;