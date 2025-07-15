import React from 'react';
import { FaHeart } from "react-icons/fa";
import { BsBookmarkPlusFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import RatingStars from './RatingStars';
import ReviewForm from './ReviewForm';
import moviesData from '../../data/movies.json'; 

const MovieDetails = ({ movie, onBack, onWatchlistToggle, onFavoriteToggle, isInWatchlist, isInFavorites, onSubmitReview }) => {
  if (!movie) {
    return <div className="text-white">Loading movie details...</div>;
  }

  const getMovieData = (movieId) => {
    const movies = Array.isArray(moviesData) ? moviesData : moviesData.movies || [];
    return movies.find(m => m.id === movieId) || movie;
  };

  const fullMovieData = getMovieData(movie.id);

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-[#0ff0fc] hover:text-[#0dd4d9] transition-colors"
      >
        ← Back to Movies
      </button>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <img 
            src={fullMovieData.poster} 
            alt={fullMovieData.title}
            className="w-full rounded-lg"
          />
        </div>
        
        <div className="lg:w-2/3 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[#f0f0f0] text-3xl font-bold mb-2">{fullMovieData.title}</h1>
              <div className="flex items-center space-x-4 text-[#a0aec0]">
                <span>{fullMovieData.year}</span>
                <span>{fullMovieData.genre}</span>
                {fullMovieData.duration && <span>{fullMovieData.duration}</span>}
              </div>
            </div>
            <button
              onClick={() => onFavoriteToggle(fullMovieData.id)}
              className={`p-2 rounded-full ${isInFavorites ? 'bg-[#ff1744] text-white' : 'bg-[#1a1a1a] text-[#a0aec0]'} hover:bg-[#ff1744] hover:text-white transition-colors`}
            >
              <FaHeart className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <RatingStars rating={Math.round(fullMovieData.rating / 2)} size="w-6 h-6" />
            <span className="text-[#f0f0f0] text-lg">{fullMovieData.rating}/10</span>
          </div>
          
          {fullMovieData.description && (
            <p className="text-[#f0f0f0] text-lg leading-relaxed">{fullMovieData.description}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {fullMovieData.director && (
              <div>
                <span className="text-[#a0aec0]">Director:</span>
                <span className="text-[#f0f0f0] ml-2">{fullMovieData.director}</span>
              </div>
            )}
            {fullMovieData.cast && fullMovieData.cast.length > 0 && (
              <div>
                <span className="text-[#a0aec0]">Cast:</span>
                <span className="text-[#f0f0f0] ml-2">{fullMovieData.cast.join(', ')}</span>
              </div>
            )}
            {fullMovieData.runtime && (
              <div>
                <span className="text-[#a0aec0]">Runtime:</span>
                <span className="text-[#f0f0f0] ml-2">{fullMovieData.runtime}</span>
              </div>
            )}
            {fullMovieData.language && (
              <div>
                <span className="text-[#a0aec0]">Language:</span>
                <span className="text-[#f0f0f0] ml-2">{fullMovieData.language}</span>
              </div>
            )}
            {fullMovieData.country && (
              <div>
                <span className="text-[#a0aec0]">Country:</span>
                <span className="text-[#f0f0f0] ml-2">{fullMovieData.country}</span>
              </div>
            )}
            {fullMovieData.budget && (
              <div>
                <span className="text-[#a0aec0]">Budget:</span>
                <span className="text-[#f0f0f0] ml-2">{fullMovieData.budget}</span>
              </div>
            )}
            {fullMovieData.boxOffice && (
              <div>
                <span className="text-[#a0aec0]">Box Office:</span>
                <span className="text-[#f0f0f0] ml-2">{fullMovieData.boxOffice}</span>
              </div>
            )}
            {fullMovieData.awards && (
              <div>
                <span className="text-[#a0aec0]">Awards:</span>
                <span className="text-[#f0f0f0] ml-2">{fullMovieData.awards}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onWatchlistToggle(fullMovieData.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isInWatchlist 
                  ? 'bg-[#0ff0fc] text-black hover:bg-[#0dd4d9]' 
                  : 'bg-[#1a1a1a] text-[#f0f0f0] hover:bg-[#0ff0fc] hover:text-black'
              }`}
            >
              <BsBookmarkPlusFill className="w-4 h-4" />
              <span>{isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
            </button>
            
            <button className="flex items-center space-x-2 bg-[#39ff14] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#32e612] transition-colors">
              <FaPlay className="w-4 h-4" />
              <span>Watch Now</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-[#f0f0f0] text-xl font-semibold mb-4">User Reviews</h3>
          <div className="space-y-4">
            {fullMovieData.reviews && fullMovieData.reviews.length > 0 ? (
              fullMovieData.reviews.map(review => (
                <div key={review.id} className="bg-[#1a1a1a] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#f0f0f0] font-medium">{review.user}</span>
                    <RatingStars rating={review.rating} />
                  </div>
                  <p className="text-[#a0aec0]">{review.comment}</p>
                  {review.date && (
                    <p className="text-[#666] text-xs mt-2">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-[#1a1a1a] p-4 rounded-lg">
                <p className="text-[#a0aec0]">No reviews yet. Be the first to review this movie!</p>
              </div>
            )}
          </div>
        </div>
        
        <ReviewForm onSubmitReview={onSubmitReview} />
      </div>
    </div>
  );
};

export default MovieDetails;