import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

function Pin({ item }) {
  const lat = item.latitude || 27.7172;
  const lng = item.longitude || 85.3240; 

  return (
    <Marker position={[lat, lng]}>
      <Popup>
        <div className="flex gap-5">
          <div className="flex flex-col justify-between">
          <Link to={`/${item.propertyID}`}>{item.propertyTitle}</Link>  
          <b>Rs. {item.propertyPrice}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
