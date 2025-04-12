
// import { useState, useCallback, useEffect } from "react";
// import { CloudUpload, X, ChevronLeft, ChevronRight } from "lucide-react";

// const ImageUploader = ({ onImagesUploaded, clearImages  }) => {
//   const [images, setImages] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [error, setError] = useState("");
//   const maxImages = 6;
//   const imagesPerPage = 2;

//   useEffect(() => {
//     if (clearImages) {
//       setImages([]); 
//     }
//   }, [clearImages]);


//   const handleFileChange = useCallback((e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     // Validate file types
//     const validTypes = ["image/jpeg", "image/png", "image/webp"];
//     const invalidFiles = files.filter(file => !validTypes.includes(file.type));

//     if (invalidFiles.length > 0) {
//       setError("Only JPG, PNG, and WebP images are allowed");
//       return;
//     }

//     // Validate file sizes (optional)
//     const maxSize = 5 * 1024 * 1024; // 5MB
//     const oversizedFiles = files.filter(file => file.size > maxSize);
//     if (oversizedFiles.length > 0) {
//       setError("Some images are too large (max 5MB each)");
//       return;
//     }

//     setImages((prevImages) => {
//       const newImages = [...prevImages, ...files].slice(0, maxImages);
//       onImagesUploaded(newImages);
//       return newImages;
//     });

//     setCurrentIndex(0);
//     setError(""); 
//   }, [onImagesUploaded]);

//   const removeImage = useCallback((index) => {
//     setImages(prevImages => {
//       const updatedImages = prevImages.filter((_, i) => i !== index);
//       onImagesUploaded(updatedImages);

//       // Adjust current index if needed
//       if (currentIndex >= updatedImages.length) {
//         setCurrentIndex(Math.max(0, updatedImages.length - imagesPerPage));
//       }

//       return updatedImages;
//     });
//   }, [currentIndex, imagesPerPage, onImagesUploaded]);

//   const nextSlide = useCallback(() => {
//     if (currentIndex + imagesPerPage < images.length) {
//       setCurrentIndex(currentIndex + imagesPerPage);
//     }
//   }, [currentIndex, images.length, imagesPerPage]);

//   const prevSlide = useCallback(() => {
//     setCurrentIndex(prevIndex => Math.max(0, prevIndex - imagesPerPage));
//   }, [imagesPerPage]);

//   const canShowNextArrow = currentIndex + imagesPerPage < images.length;
//   const canShowPrevArrow = currentIndex > 0;

//   return (
//     <div className="col-span-2 h-56">
//       <label className="block mb-2 font-medium">Upload Images (Max {maxImages})</label>
//       <div className="flex flex-col items-center justify-center w-full border p-2 rounded h-48 relative">
//         {images.length === 0 ? (
//           <label className="flex flex-col items-center cursor-pointer">
//             <CloudUpload className="h-10 w-10 text-gray-500" />
//             <span className="text-gray-500 text-sm">Select Images</span>
//             <input
//               type="file"
//               multiple
//               accept="image/jpeg, image/png, image/webp"
//               onChange={handleFileChange}
//               className="hidden"
//             />
//           </label>
//         ) : (
//           <>
//             {/* Image Carousel */}
//             <div className="relative flex items-center w-full mt-3">
//               {canShowPrevArrow && (
//                 <button
//                   className="absolute left-0 bg-gray-800 text-white rounded-full p-2 z-50 hover:bg-gray-700 transition-colors"
//                   onClick={prevSlide}
//                   aria-label="Previous images"
//                 >
//                   <ChevronLeft size={20} />
//                 </button>
//               )}

//               <div className="flex w-full justify-center gap-2">
//                 {images.slice(currentIndex, currentIndex + imagesPerPage).map((file, index) => (
//                   <div key={index} className="relative w-1/2 h-24 rounded overflow-hidden group">
//                     <img
//                       src={URL.createObjectURL(file)}
//                       alt={`Property image ${index + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                     <button
//                       className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
//                       onClick={() => removeImage(index + currentIndex)}
//                       aria-label="Remove image"
//                     >
//                       <X size={12} />
//                     </button>
//                   </div>
//                 ))}
//               </div>

//               {canShowNextArrow && (
//                 <button
//                   className="absolute right-0 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition-colors"
//                   onClick={nextSlide}
//                   aria-label="Next images"
//                 >
//                   <ChevronRight size={20} />
//                 </button>
//               )}
//             </div>

//             {/* Image Counter */}
//             <p className="mt-2 mb-1 text-sm text-gray-500">
//               {images.length} / {maxImages} images selected
//             </p>

//             {/* Error message */}
//             {error && <p className="text-red-500 text-sm mb-1">{error}</p>}

//             {/* Select More Images */}
//             {images.length < maxImages && (
//               <label className="text-blue-600 text-sm cursor-pointer hover:text-blue-800 transition-colors">
//                 Select More Images
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/jpeg, image/png, image/webp"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </label>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImageUploader;

// import { useState, useCallback, useEffect } from "react";
// import { CloudUpload, X, ChevronLeft, ChevronRight } from "lucide-react";

// const ImageUploader = ({ 
//   onImagesUploaded, 
//   clearImages, 
//   existingImages = [], 
//   onDeleteImage 
// }) => {
//   const [images, setImages] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [error, setError] = useState("");
//   const maxImages = 6;
//   const imagesPerPage = 2;

//   // Combine existing images and newly uploaded images for display
//   const allImages = [
//     ...existingImages.map(img => ({ ...img, isExisting: true })),
//     ...images.map(img => ({ file: img, isExisting: false }))
//   ];

//   useEffect(() => {
//     if (clearImages) {
//       setImages([]); 
//     }
//   }, [clearImages]);

//   const handleFileChange = useCallback((e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     // Validate file types
//     const validTypes = ["image/jpeg", "image/png", "image/webp"];
//     const invalidFiles = files.filter(file => !validTypes.includes(file.type));

//     if (invalidFiles.length > 0) {
//       setError("Only JPG, PNG, and WebP images are allowed");
//       return;
//     }

//     // Validate file sizes (optional)
//     const maxSize = 5 * 1024 * 1024; // 5MB
//     const oversizedFiles = files.filter(file => file.size > maxSize);
//     if (oversizedFiles.length > 0) {
//       setError("Some images are too large (max 5MB each)");
//       return;
//     }

//     setImages((prevImages) => {
//       const newImages = [...prevImages, ...files].slice(0, maxImages - existingImages.length);
//       onImagesUploaded(newImages);
//       return newImages;
//     });

//     setCurrentIndex(0);
//     setError(""); 
//   }, [onImagesUploaded, existingImages.length]);

//   const removeImage = useCallback((index) => {
//     const imageToRemove = allImages[index];

//     if (imageToRemove.isExisting) {
//       if (onDeleteImage && imageToRemove.imageID) {
//         onDeleteImage(imageToRemove.imageID);
//       }
//       return;
//     }

//     // Remove from local state for new uploads
//     setImages(prevImages => {
//       const updatedImages = prevImages.filter((_, i) => i !== (index - existingImages.length));
//       onImagesUploaded(updatedImages);

//       // Adjust current index if needed
//       if (currentIndex >= updatedImages.length + existingImages.length) {
//         setCurrentIndex(Math.max(0, (updatedImages.length + existingImages.length) - imagesPerPage));
//       }

//       return updatedImages;
//     });
//   }, [currentIndex, imagesPerPage, onImagesUploaded, existingImages.length, onDeleteImage, allImages]);

//   const nextSlide = useCallback(() => {
//     if (currentIndex + imagesPerPage < allImages.length) {
//       setCurrentIndex(currentIndex + imagesPerPage);
//     }
//   }, [currentIndex, allImages.length, imagesPerPage]);

//   const prevSlide = useCallback(() => {
//     setCurrentIndex(prevIndex => Math.max(0, prevIndex - imagesPerPage));
//   }, [imagesPerPage]);

//   const canShowNextArrow = currentIndex + imagesPerPage < allImages.length;
//   const canShowPrevArrow = currentIndex > 0;

//   return (
//     <div className="col-span-2 h-56">
//       <label className="block mb-2 font-medium">Upload Images (Max {maxImages})</label>
//       <div className="flex flex-col items-center justify-center w-full border p-2 rounded h-48 relative">
//         {allImages.length === 0 ? (
//           <label className="flex flex-col items-center cursor-pointer">
//             <CloudUpload className="h-10 w-10 text-gray-500" />
//             <span className="text-gray-500 text-sm">Select Images</span>
//             <input
//               type="file"
//               multiple
//               accept="image/jpeg, image/png, image/webp"
//               onChange={handleFileChange}
//               className="hidden"
//             />
//           </label>
//         ) : (
//           <>
//             {/* Image Carousel */}
//             <div className="relative flex items-center w-full mt-3">
//               {canShowPrevArrow && (
//                 <button
//                   className="absolute left-0 bg-gray-800 text-white rounded-full p-2 z-50 hover:bg-gray-700 transition-colors"
//                   onClick={prevSlide}
//                   aria-label="Previous images"
//                 >
//                   <ChevronLeft size={20} />
//                 </button>
//               )}

//               <div className="flex w-full justify-center gap-2">
//                 {allImages.slice(currentIndex, currentIndex + imagesPerPage).map((image, index) => (
//                   <div key={index} className="relative w-1/2 h-24 rounded overflow-hidden group">
//                     <img
//                       src={image.isExisting ? image.imageUrl : URL.createObjectURL(image.file)}
//                       alt={`Property image ${index + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                     <button
//                       className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         removeImage(index + currentIndex);
//                       }}
//                       aria-label="Remove image"
//                     >
//                       <X size={12} />
//                     </button>
//                   </div>
//                 ))}
//               </div>

//               {canShowNextArrow && (
//                 <button
//                   className="absolute right-0 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition-colors"
//                   onClick={nextSlide}
//                   aria-label="Next images"
//                 >
//                   <ChevronRight size={20} />
//                 </button>
//               )}
//             </div>

//             {/* Image Counter */}
//             <p className="mt-2 mb-1 text-sm text-gray-500">
//               {allImages.length} / {maxImages} images selected
//             </p>

//             {/* Error message */}
//             {error && <p className="text-red-500 text-sm mb-1">{error}</p>}

//             {/* Select More Images */}
//             {allImages.length < maxImages && (
//               <label className="text-blue-600 text-sm cursor-pointer hover:text-blue-800 transition-colors">
//                 Select More Images
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/jpeg, image/png, image/webp"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </label>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImageUploader;

import { useState, useCallback, useEffect, useMemo } from "react";
import { CloudUpload, X, ChevronLeft, ChevronRight } from "lucide-react";

const ImageUploader = ({
  onImagesUploaded,
  clearImages,
  existingImages = [],
  onDeleteImage
}) => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const maxImages = 6;
  const imagesPerPage = 2;

  // Memoize the combined images to prevent unnecessary re-calculations

  const allImages = useMemo(() => [
    ...existingImages.map(img => ({ ...img, isExisting: true })),
    ...images.map(img => ({ file: img, isExisting: false }))
  ], [existingImages, images]);

  useEffect(() => {
    if (clearImages) {
      setImages([]);
    }
  }, [clearImages]);

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Validate file types
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setError("Only JPG, PNG, and WebP images are allowed");
      return;
    }

    // Validate file sizes (optional)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError("Some images are too large (max 5MB each)");
      return;
    }

    setImages((prevImages) => {
      const newImages = [...prevImages, ...files].slice(0, maxImages - existingImages.length);
      onImagesUploaded(newImages);
      return newImages;
    });

    setCurrentIndex(0);
    setError("");
  }, [onImagesUploaded, existingImages.length]);

  const removeImage = useCallback((index) => {
    const imageToRemove = allImages[index];

    if (imageToRemove.isExisting) {
      if (onDeleteImage && imageToRemove.imageID) {
        onDeleteImage(imageToRemove.imageID);
      }
      return;
    }

    // Remove from local state for new uploads
    setImages(prevImages => {
      const updatedImages = prevImages.filter((_, i) => i !== (index - existingImages.length));
      onImagesUploaded(updatedImages);

      // Adjust current index if needed
      if (currentIndex >= updatedImages.length + existingImages.length) {
        setCurrentIndex(Math.max(0, (updatedImages.length + existingImages.length) - imagesPerPage));
      }

      return updatedImages;
    });
  }, [currentIndex, imagesPerPage, onImagesUploaded, existingImages.length, onDeleteImage, allImages]);

  const nextSlide = useCallback(() => {
    if (currentIndex + imagesPerPage < allImages.length) {
      setCurrentIndex(currentIndex + imagesPerPage);
    }
  }, [currentIndex, allImages.length, imagesPerPage]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prevIndex => Math.max(0, prevIndex - imagesPerPage));
  }, [imagesPerPage]);

  const canShowNextArrow = currentIndex + imagesPerPage < allImages.length;
  const canShowPrevArrow = currentIndex > 0;

  return (
    <div className="col-span-2 h-56">
      <label className="block mb-2 font-medium">Upload Images (Max {maxImages})</label>
      <div className="flex flex-col items-center justify-center w-full border p-2 rounded h-48 relative">
        {allImages.length === 0 ? (
          <label className="flex flex-col items-center cursor-pointer">
            <CloudUpload className="h-10 w-10 text-gray-500" />
            <span className="text-gray-500 text-sm">Select Images</span>
            <input
              type="file"
              multiple
              accept="image/jpeg, image/png, image/webp"
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
                  className="absolute left-0 bg-gray-800 text-white rounded-full p-2 z-50 hover:bg-gray-700 transition-colors"
                  onClick={prevSlide}
                  aria-label="Previous images"
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              <div className="flex w-full justify-center gap-2">
                {allImages.slice(currentIndex, currentIndex + imagesPerPage).map((image, index) => (
                  <div key={index} className="relative w-1/2 h-24 rounded overflow-hidden group">
                    <img
                      src={image.isExisting ? image.imageUrl : URL.createObjectURL(image.file)}
                      className="w-full h-full object-cover"
                    />
                    <button
                      className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index + currentIndex);
                      }}
                      aria-label="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {canShowNextArrow && (
                <button
                  className="absolute right-0 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition-colors"
                  onClick={nextSlide}
                  aria-label="Next images"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>

            {/* Image Counter */}
            <p className="mt-2 mb-1 text-sm text-gray-500">
              {allImages.length} / {maxImages} images selected
            </p>

            {/* Error message */}
            {error && <p className="text-red-500 text-sm mb-1">{error}</p>}

            {/* Select More Images */}
            {allImages.length < maxImages && (
              <label className="text-blue-600 text-sm cursor-pointer hover:text-blue-800 transition-colors">
                Select More Images
                <input
                  type="file"
                  multiple
                  accept="image/jpeg, image/png, image/webp"
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
