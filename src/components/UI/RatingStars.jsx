import React from 'react'
import { useState } from 'react';
import { CiStar } from "react-icons/ci";

const RatingStars = ({ rating, maxRating = 5, size = "w-4 h-4", interactive = false, onRate }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[...Array(maxRating)].map((_, index) => {
        const starRating = index + 1;
        const isActive = interactive 
          ? starRating <= (hoveredRating || rating)
          : starRating <= rating;
        
        return (
          <CiStar
            key={index}
            className={`${size} ${isActive ? 'text-yellow-400 fill-current' : 'text-gray-400'} ${
              interactive ? 'cursor-pointer hover:text-yellow-400' : ''
            }`}
            onClick={() => interactive && onRate && onRate(starRating)}
            onMouseEnter={() => interactive && setHoveredRating(starRating)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
          />
        );
      })}
    </div>
  );
};

export default RatingStars