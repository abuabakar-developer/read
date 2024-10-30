import { useState } from "react";

interface Review {
  id: string;
  content: string;
  author: string;
  rating: number;
}

interface ReviewModalProps {
  onClose: () => void;
  reviews: Review[];
  bookId: string;
}

export default function ReviewModal({ onClose, reviews = [], bookId }: ReviewModalProps) {
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [showTips, setShowTips] = useState(false); // State to toggle tips
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (!reviewTitle || !reviewContent || rating === null) {
      alert("Please provide a title, review, and a rating.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId,
          title: reviewTitle,
          content: reviewContent,
          rating,
        }),
      });

      if (res.ok) {
        alert("Review submitted successfully!");
        setReviewTitle("");
        setReviewContent("");
        setRating(null);
        onClose();
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("An error occurred while submitting your review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 z-50 flex justify-center items-center transition-opacity">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-[90%] max-w-2xl transform transition-transform hover:scale-105">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Write Your Review</h2>

        {/* Tips for Reviewers */}
        <div className="mb-6">
          <button
            onClick={() => setShowTips(!showTips)}
            className="text-red-600 hover:text-red-800 underline mb-2"
          >
            Tips for Reviewers
          </button>
          {showTips && (
            <ul className="pl-4 mb-4 text-sm text-gray-700 space-y-3 animate-fadeIn">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Be specific about what you liked or disliked.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Provide constructive feedback with examples.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Keep it respectful and honest.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Avoid spoilers when discussing the plot.</span>
              </li>
            </ul>
          )}
        </div>

        {/* Review Form */}
        <div className="space-y-6 mb-4">
          {/* Title Input */}
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Title of your review (e.g., 'Great Book!')"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
          />

          {/* Rating Stars */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-gray-700 font-semibold">Rate this item:</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 
                  ${rating === star ? "bg-yellow-500 text-white scale-110" : "bg-gray-300 text-gray-700 hover:bg-yellow-300 hover:scale-105"}`}
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} out of 5`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          {/* Review Content */}
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your review here (e.g., 'I really enjoyed the character development...')"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            rows={5}
          />
        </div>

        <div className="flex justify-end">
          <button
            className={`px-6 py-3 bg-blue-600 text-white rounded-lg mr-2 transition-all duration-300 
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={submitReview}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="4"></circle>
                <path d="M4 12a8 8 0 014-6.93" strokeWidth="4"></path>
              </svg>
            ) : (
              "Submit Review"
            )}
          </button>
          <button
            className="px-6 py-3 bg-gray-400 text-gray-800 rounded-lg hover:bg-gray-500 transition-all duration-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}












