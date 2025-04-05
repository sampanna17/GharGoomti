import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Pin from "./Pin";

function Map({ items }) {
    const defaultLat = 27.7172;
    const defaultLng = 85.3240;

    const center = items.length === 1
        ? [items[0]?.latitude || defaultLat, items[0]?.longitude || defaultLng]
        : [defaultLat, defaultLng];

    return (
        <MapContainer
            center={center}
            zoom={14}
            scrollWheelZoom
            className="w-full h-full rounded-2xl z-0"
            attributionControl={false}
            zoomControl={false}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {items.map((item) => (
                <Pin key={item.propertyID} item={item} />
            ))}
        </MapContainer>
    );
}

export default Map;
