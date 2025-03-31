import React, { useState } from "react";
import Search from "./components/Search";
import Editor from "./components/Editor";

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  console.log("🚀 ~ App ~ selectedImage:", selectedImage);
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-6xl p-4 sm:p-8 bg-gray-800 shadow-lg rounded-2xl">
        {!selectedImage ? (
          <Search setSelectedImage={setSelectedImage} />
        ) : (
          <Editor image={selectedImage} setSelectedImage={setSelectedImage} />
        )}
      </div>
    </div>
  );
};

export default App;
