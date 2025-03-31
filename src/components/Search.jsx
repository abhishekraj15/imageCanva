import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import toast from "react-hot-toast";
import { fetchImages } from "../api/services";

const Search = ({ setSelectedImage }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchImages = debounce(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);

    fetchImages(query)
      .then((response) => {
        setResults(response?.data?.photos);
        toast.success("Image loaded successfully.");
      })
      .catch(() => {
        toast.error("Failed to fetch images. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, 500);

  useEffect(() => {
    searchImages();
    return () => searchImages.cancel();
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-screen">
      <div className="sticky top-0 bg-gray-900 z-10 p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for an image..."
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(20)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="w-full h-[200px] bg-gray-700 rounded-lg animate-pulse"
                ></div>
              ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((img) => (
              <div
                key={img.id}
                className="relative group overflow-hidden rounded-lg shadow-lg"
              >
                <img
                  src={img.src.medium}
                  alt={img.photographer}
                  className="w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity text-white text-lg font-semibold"
                  onClick={() => setSelectedImage(img.src.large)}
                >
                  Add Captions
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-10">
            <img
              src="/not-found.png"
              alt="Not found"
              className="w-64 h-64 object-contain"
            />
            <p className="text-gray-400 text-lg mt-4">
              No Image found. Please type above input box for search specific
              image.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
