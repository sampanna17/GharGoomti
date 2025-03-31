import apartment1 from "../assets/loop/apartment1.png";
import apartment2 from "../assets/loop/apartment2.png";
import apartment from "../assets/loop/apartment.png";
import apartmentBuilding from "../assets/loop/apartment-building.png";
import home from "../assets/loop/home.png";
import house from "../assets/loop/house.png";
import house1 from "../assets/loop/house1.png";
import house2 from "../assets/loop/house2.png";
import property from "../assets/loop/property.png";

const images = [
  { src: apartment1, alt: "Apartment1" },
  { src: apartment2, alt: "Apartment2" },
  { src: apartment, alt: "Apartment" },
  { src: apartmentBuilding, alt: "Apartment Building" },
  { src: home, alt: "Home" },
  { src: house, alt: "House" },
  { src: house1, alt: "House 1" },
  { src: house2, alt: "House 2" },
  { src: property, alt: "Property" },
];

const ImageLoop = () => {
  return (
    <div className="overflow-hidden relative bg-white mt-4 py-6 w-full">
      <div className="flex w-full gap-5 whitespace-nowrap animate-scroll">
        {Array.from({ length: 4 }).flatMap((_, i) =>
          images.map((image, index) => (
            <div key={`${image.alt}-${i}-${index}`} className="flex-shrink-0">
              <img
                src={image.src}
                alt={image.alt}
                className="h-12 mx-10 pointer-events-none"
                loading="lazy"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ImageLoop;
