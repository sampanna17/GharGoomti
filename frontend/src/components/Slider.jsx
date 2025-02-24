import { useState } from "react";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);

  const changeSlide = (direction) => {
    setImageIndex((prevIndex) => {
      if (direction === "left") {
        return prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      } else {
        return prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      }
    });
  };

  return (
    <div className="w-full h-[350px] flex gap-5 sm:h-[280px]">
      {imageIndex !== null && (
        <div className="fixed inset-0 bg-black flex justify-between items-center z-50">
          <button
            className="flex-1 flex items-center justify-center"
            onClick={() => changeSlide("left")}
          >
            <img src="/arrow.png" alt="Left" className="w-12 md:w-8 sm:w-5" />
          </button>
          <div className="flex-10 flex justify-center items-center">
            <img src={images[imageIndex]} alt="" className="w-full h-full object-cover" />
          </div>
          <button
            className="flex-1 flex items-center justify-center"
            onClick={() => changeSlide("right")}
          >
            <img
              src="/arrow.png"
              alt="Right"
              className="w-12 md:w-8 sm:w-5 rotate-180"
            />
          </button>
          <button
            className="absolute top-5 right-5 text-white text-3xl font-bold cursor-pointer"
            onClick={() => setImageIndex(null)}
          >
            X
          </button>
        </div>
      )}
      <div className="flex-3 sm:flex-2 cursor-pointer">
        <img
          src={images[0]}
          alt=""
          className="w-full h-full object-cover rounded-lg"
          onClick={() => setImageIndex(0)}
        />
      </div>
      <div className="flex-1 flex flex-col justify-between gap-5 sm:gap-3">
        {images.slice(1).map((image, index) => (
          <img
            src={image}
            alt=""
            key={index}
            className="h-[100px] sm:h-[80px] object-cover rounded-lg cursor-pointer"
            onClick={() => setImageIndex(index + 1)}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
