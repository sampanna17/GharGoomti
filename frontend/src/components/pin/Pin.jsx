import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";

function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="popupContainer">
          <img src={item?.images?.[0]?.imageURL} alt="" />
          <div className="textContainer">
            <Link to={`/${item.propertyID}`}>{item.propertyTitle}</Link>
            <span>{item.bedrooms} bedroom</span>
            <b>$ {item.propertyPrice}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;