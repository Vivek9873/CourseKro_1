import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function Card({ thumbnail, title, category, price, id, reviews }) {
  const navigate = useNavigate();
  const calculataeAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculataeAvgReview(reviews);
  return (
    <div
      onClick={() => navigate("/viewcourse/" + id)}
      className="max-w-xs w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-y-gray-300"
    >
      <img src={thumbnail} alt="" className="w-full h-48 object-cover" />

      <div className="p-5 space-y-2 ">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-700 capitalize">
          {category}
        </span>

        <div className="flex justify-between text-sm text-gray-600 mt-3 px-[10px]">
          <span className="font-semibold text-gray-800 ">{"₹" + price}</span>
          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            {avgRating}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;
