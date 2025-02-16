import { useState } from "react";
import { CloudUpload, X, ChevronLeft, ChevronRight } from "lucide-react";

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxImages = 6;
  const imagesPerPage = 2;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setImages((prevImages) => {
      const newImages = [...prevImages, ...files].slice(0, maxImages);
      return newImages;
    });

    setCurrentIndex(0);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    if (currentIndex >= updatedImages.length) {
      setCurrentIndex(Math.max(0, updatedImages.length - imagesPerPage));
    }
  };

  const nextSlide = () => {
    if (currentIndex + imagesPerPage < images.length) {
      setCurrentIndex(currentIndex + imagesPerPage);
    }
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - imagesPerPage));
  };

  const canShowNextArrow = currentIndex + imagesPerPage < images.length;
  const canShowPrevArrow = currentIndex > 0;

  return (
    <div className="col-span-2 h-56">
      <label className="block mb-2 font-medium">Upload Images</label>
      <div className="flex flex-col items-center justify-center w-full border p-2 rounded h-48 relative">
        {images.length === 0 ? (
          <label className="flex flex-col items-center cursor-pointer">
            <CloudUpload className="h-10 w-10 text-gray-500" />
            <span className="text-gray-500 text-sm">Select Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <>
            {/* Image Carousel */}
            <div className="relative flex items-center w-full mt-3">
              {canShowPrevArrow && (
                <button
                  className="absolute left-0 bg-gray-800 text-white rounded-full p-2 z-50"
                  onClick={prevSlide}
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              <div className="flex w-full justify-center gap-2">
                {images.slice(currentIndex, currentIndex + imagesPerPage).map((file, index) => (
                  <div key={index} className="relative w-1/2 h-24 rounded overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1 text-xs"
                      onClick={() => removeImage(index + currentIndex)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {canShowNextArrow && (
                <button
                  className="absolute right-0 bg-gray-800 text-white rounded-full p-2"
                  onClick={nextSlide}
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>

            {/* Image Counter */}
            <p className="mt-2 mb-4 text-sm text-gray-500">
              {images.length} / {maxImages} images selected
            </p>

            {/* Select More Images */}
            {images.length < maxImages && (
              <label className="text-blue-800 text-sm cursor-pointer">
                Select More Images
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;