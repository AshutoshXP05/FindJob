import React from "react";

const categories = [
   "Frontend Developer",
  "Backend Developer",
  "FullStack Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile App Developer",
  "Cloud Engineer",
  "Cybersecurity Analyst",
  "UI/UX Designer",
  "Quality Assurance Engineer",
  "Product Manager",
  "Software Architect"
];

function CategoryCarousel() {
  return (

     <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Popular Job Roles
      </h2>
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((job, idx) => (
          <button
            key={idx}
            className="
              px-5 py-2
              border border-gray-300
              rounded-full
              text-gray-700
              font-medium
              hover:bg-indigo-600 hover:text-white
              transition-colors duration-300
              focus:outline-none focus:ring-2 focus:ring-indigo-400
            "
          >
            {job}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryCarousel;
