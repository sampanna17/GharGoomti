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
  const repeatedImages = Array.from({ length: 10 }, () => images).flat(); // Creates 10 copies
  return (
    <div className="overflow-hidden relative bg-white py-6">
      <div className="flex w-max animate-scroll gap-5 whitespace-nowrap">
        {repeatedImages.map((image, index) => (
          <div key={index} className="flex-shrink-0">
            <img src={image.src} alt={image.alt} className="h-12 mx-10" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageLoop;
