import React from 'react'
import { useState } from 'react';
import RatingStars from './RatingStars';
import { FaHeart } from "react-icons/fa";
import { BsBookmarkPlusFill } from "react-icons/bs";


const ReviewForm = ({ onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0 && comment.trim()) {
      onSubmitReview({ rating, comment });
      setRating(0);
      setComment('');
    }
  };

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg">
      <h3 className="text-[#f0f0f0] text-xl font-semibold mb-4">Submit Your Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[#f0f0f0] text-sm mb-2">Your Rating</label>
          <RatingStars 
            rating={rating} 
            interactive={true} 
            onRate={setRating} 
            size="w-6 h-6"
          />
        </div>
        
        <div>
          <label className="block text-[#f0f0f0] text-sm mb-2">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this movie..."
            className="w-full bg-[#0d0d0d] text-[#f0f0f0] border border-gray-600 rounded-lg p-3 h-32 focus:border-[#0ff0fc] focus:outline-none resize-none"
            required
          />
        </div>
        
        <button
          type="submit"
          className="bg-[#0ff0fc] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#0dd4d9] transition-colors"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm