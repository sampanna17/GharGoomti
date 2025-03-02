import { useState, useEffect } from "react";
import LeftArrow from '../assets/left-arrow.png';
import RightArrow from '../assets/right-arrow.png';
import Cross from '../assets/close.png';

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);

  useEffect(() => {
    if (imageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [imageIndex]);

  const changeSlide = (direction) => {
    setImageIndex((prevIndex) => {
      if (direction === "left") {
        return prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      } else {
        return prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      }
    });
  };

  const isFiveImages = images.length === 5;
  const isSixImages = images.length === 6;

  return (
    <div className="w-full h-[450px] flex gap-5 sm:h-[380px]">
      {imageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
          <div
            className="relative p-4 rounded-lg flex flex-col items-center transform transition-transform duration-300 scale-y-100"
            style={{ transform: imageIndex === null ? "scaleY(0)" : "scaleY(1)" }}
          >
            <button
              className="absolute -top-4 right-16 text-gray-600 text-xl font-bold"
              onClick={() => setImageIndex(null)}
            >
              <img src={Cross} alt="Close" className="w-5 h-auto filter invert" />
            </button>
            <div className="relative flex items-center">
              <button
                className="left-2 p-2 filter invert"
                onClick={() => changeSlide("left")}
              >
                <img src={LeftArrow} alt="Left" className="w-9 h-10 opacity-80 hover:opacity-100" />
              </button>
              <img
                src={images[imageIndex]}
                alt="Preview"
                className="w-[600px] h-[500px] object-cover rounded-lg"
              />
              <button
                className="right-2 p-2 filter invert"
                onClick={() => changeSlide("right")}
              >
                <img src={RightArrow} alt="Right" className="w-8 opacity-80 hover:opacity-100" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conditionally render based on the number of images */}
      <div className={`flex ${isSixImages ? 'flex-col' : (isFiveImages ? 'flex-col' : 'flex-row')} gap-5 sm:h-[380px]`}>

        {/* First image container */}
        <div className={`${images.length === 4 ? 'flex-3 sm:flex-2 w-[550px]' : (isFiveImages ? 'grid grid-cols-2 gap-4' : (isSixImages ? 'grid grid-cols-3 gap-2' : 'flex-3 sm:flex-2'))} cursor-pointer`}>
          {isSixImages ? (
            <>
              <img
                src={images[0]}
                alt=""
                className="w-full h-full object-cover rounded-lg"
                onClick={() => setImageIndex(0)}
              />
              <img
                src={images[1]}
                alt=""
                className="w-full h-full object-cover rounded-lg"
                onClick={() => setImageIndex(1)}
              />
              <img
                src={images[2]}
                alt=""
                className="w-full h-full object-cover rounded-lg"
                onClick={() => setImageIndex(2)}
              />
            </>
          ) : isFiveImages ? (
            <>
              <img
                src={images[0]}
                alt=""
                className="w-full h-full object-cover rounded-lg"
                onClick={() => setImageIndex(0)}
              />
              <img
                src={images[1]}
                alt=""
                className="w-full h-full object-cover rounded-lg"
                onClick={() => setImageIndex(1)}
              />
            </>
          ) : (
            <>
              <img
                src={images[0]}
                alt=""
                className="w-full h-full object-cover rounded-lg"
                onClick={() => setImageIndex(0)}
              />
            </>
          )}
        </div>

        {/* Second image container */}
        <div className={`flex ${isSixImages ? 'flex-row gap-4 w-full' : (images.length === 4 ? 'flex-1 flex flex-col justify-between gap-2 sm:gap-1' : (isFiveImages ? 'grid grid-cols-3 gap-4 w-full' : 'flex-1 flex-col justify-between gap-4 sm:gap-2'))}`}>
          {isSixImages ? (
            <>
              <img
                src={images[3]}
                alt=""
                key={3}
                className="h-[200px] sm:h-[160px] w-[calc(33.33%-10px)] object-cover rounded-lg cursor-pointer"
                onClick={() => setImageIndex(3)}
              />
              <img
                src={images[4]}
                alt=""
                key={4}
                className="h-[200px] sm:h-[160px] w-[calc(33.33%-10px)] object-cover rounded-lg cursor-pointer"
                onClick={() => setImageIndex(4)}
              />
              <img
                src={images[5]}
                alt=""
                key={5}
                className="h-[200px] sm:h-[160px] w-[calc(33.33%-10px)] object-cover rounded-lg cursor-pointer"
                onClick={() => setImageIndex(5)}
              />
            </>
          ) : (
            images.slice(isFiveImages ? 2 : 1).map((image, index) => (
              <img
                src={image}
                alt=""
                key={index}
                className={`h-[200px] sm:h-[120px] ${images.length === 4 ? 'w-[220px]' : 'w-full'} object-cover rounded-lg cursor-pointer`}
                onClick={() => setImageIndex(index + (isFiveImages ? 2 : 1))}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Slider;
