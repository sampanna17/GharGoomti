import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import NumberFormat from "./FormatNumber";

function Pin({ item }) {
  const lat = item.latitude || 27.7172;
  const lng = item.longitude || 85.3240; 

  const imageUrl = item.images && item.images.length > 0 ? item.images[0] : "/default-image.jpg";

  return (
    <Marker position={[lat, lng]}>
      <Popup>
        <div className="flex gap-5">
          <img
            src={imageUrl}
            alt={item.title || "Property Image"} 
            className="w-16 h-12 object-cover rounded-md"
          />
          <div className="flex flex-col justify-between">
            <Link to={`/${item.id}`} className="text-blue-500 font-semibold">
              {item.title}
            </Link>
            <span className="text-gray-600">{item.bedroom} bedroom</span>
            <b className="text-lg">NPR. <NumberFormat value={item.price} /></b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
