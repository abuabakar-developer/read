// src/app/components/StarRating.tsx

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
}

const StarRating = ({ rating }: StarRatingProps) => {
  // Clamp the rating between 0 and 5
  const clampedRating = Math.min(Math.max(rating, 0), 5);

  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Debugging: Log the star counts
  // Remove or comment out in production
  console.log(`Rating: ${rating}, Clamped: ${clampedRating}, Full: ${fullStars}, Half: ${hasHalfStar}, Empty: ${emptyStars}`);

  return (
    <div className="flex items-center">
      {/* Full Stars */}
      {Array.from({ length: fullStars }, (_, i) => (
        <FaStar key={`full-${i}`} className="text-yellow-400" />
      ))}

      {/* Half Star */}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}

      {/* Empty Stars */}
      {Array.from({ length: emptyStars }, (_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-gray-300" />
      ))}
    </div>
  );
};

export default StarRating;




