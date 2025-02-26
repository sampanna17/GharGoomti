import { useState, useEffect } from "react";
import FloatingLabelInput from "../components/FloatingLabel";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ImageUploader from "../components/ImageUploader";

const formatNumber = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-IN").format(value.replace(/\D/g, ""));
};

function LocationPicker({ setLatitude, setLongitude }) {
    useMapEvents({
        click(e) {
            setLatitude(e.latlng.lat.toFixed(6));
            setLongitude(e.latlng.lng.toFixed(6));
        },
    });
    return null;
}

function MapUpdater({ latitude, longitude }) {
    const map = useMap();
    useEffect(() => {
        if (latitude && longitude) {
            map.setView([latitude, longitude], 16);
        }
    }, [latitude, longitude, map]);
    return null;
}

export default function AddProperty() {
    const [inputs, setInputs] = useState({
        title: "",
        price: "",
        address: "",
        city: "",
        latitude: "",
        longitude: "",
        bedroom: "",
        bathroom: "",
        kitchen: "",
        hall: "",
        type: "",
        property: "",
        images: [],
        desc: "",
        petPolicy: "",
        size: "",
    });

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === "latitude" || name === "longitude") {
            value = value.replace(/[^0-9.-]/g, "");
            if (value) value = parseFloat(value).toFixed(6);
        }
        setInputs((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg border border-gray-300 mt-32 mb-6 flex">
            {/* Left Side: Form Fields */}
            <div className="flex-[60%] pr-4 border-r border-gray-300">
                <div className="grid grid-cols-2 gap-4">
                    <FloatingLabelInput name="title" label="Title" value={inputs.title} onChange={handleChange} required />
                    <FloatingLabelInput name="price" label="Price" value={formatNumber(inputs.price)} onChange={handleChange} required />
                    <FloatingLabelInput name="address" label="Address" value={inputs.address} onChange={handleChange} required />
                    <FloatingLabelInput name="city" label="City" value={inputs.city} onChange={handleChange} required />
                    <FloatingLabelInput name="bedroom" type="number" label="Bedrooms" value={inputs.bedroom} onChange={handleChange} required />
                    <FloatingLabelInput name="bathroom" type="number" label="Bathrooms" value={inputs.bathroom} onChange={handleChange} required />
                    <FloatingLabelInput name="kitchen" type="number" label="Kitchens" value={inputs.kitchen} onChange={handleChange} required />
                    <FloatingLabelInput name="hall" type="number" label="Halls" value={inputs.hall} onChange={handleChange} required />

                    <select
                        name="type"
                        value={inputs.type}
                        onChange={handleChange}
                        className={`p-2 border rounded border-gray-300 ${inputs.type === "" ? "text-gray-500" : "text-black"}`}
                    >
                        <option value="" disabled>Select Type</option>
                        <option value="apartment" className="text-black">Apartment</option>
                        <option value="building" className="text-black"> Building</option>
                        <option value="flat" className="text-black">Flat</option>
                    </select>

                    <select
                        name="property"
                        value={inputs.property}
                        onChange={handleChange}
                        className={`p-2 border rounded border-gray-300 ${inputs.property === "" ? "text-gray-500" : "text-black"}`}
                    >
                        <option value="" disabled>
                            Select Property Type
                        </option>
                        <option value="rent" className="text-black">Rent</option>
                        <option value="sale" className="text-black">Sale</option>
                    </select>
                    
                    <FloatingLabelInput name="size" type="number" label="Size (sq ft)" value={inputs.size} onChange={handleChange} required />

                    <select
                        name="petPolicy"
                        value={inputs.petPolicy}
                        onChange={handleChange}
                        className={`p-2 border rounded border-gray-300 ${inputs.petPolicy === "" ? "text-gray-500" : "text-black"}`}
                    >
                        <option value="" disabled>
                            Pet Policy
                        </option>
                        <option value="available" className="text-black">
                            Available
                        </option>
                        <option value="unavailable" className="text-black">
                            Not Available
                        </option>
                    </select>

                    <FloatingLabelInput name="latitude" label="Latitude" value={inputs.latitude} onChange={handleChange} required />
                    <FloatingLabelInput name="longitude" label="Longitude" value={inputs.longitude} onChange={handleChange} required />

                    <textarea name="desc" placeholder="Description" value={inputs.desc} onChange={handleChange} className="col-span-2 h-20 p-2 border rounded border-gray-300"></textarea>

                    <button className="col-span-2 bg-[#2E4156] text-white p-2 rounded hover:bg-[#1A2D42] transition duration-300">Submit</button>
                </div>
            </div>

            {/* Right Side: Image Uploader & Map */}
            <div className="flex-[40%] pl-4">
                <ImageUploader />

                {/* Map Section */}
                <div className="mt-4">
                    <h3 className="font-medium mb-2">Select Location</h3>
                    <MapContainer
                        center={[27.707968, 85.319666]}
                        zoom={15}
                        scrollWheelZoom
                        style={{ height: "250px", width: "100%" }}
                        className="rounded z-0"
                        attributionControl={false}
                        zoomControl={false}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {inputs.latitude && inputs.longitude && (
                            <Marker position={[parseFloat(inputs.latitude), parseFloat(inputs.longitude)]}>
                                <Popup>
                                    Latitude: {parseFloat(inputs.latitude).toFixed(6)} <br />
                                    Longitude: {parseFloat(inputs.longitude).toFixed(6)}
                                </Popup>
                            </Marker>
                        )}
                        <MapUpdater latitude={parseFloat(inputs.latitude)} longitude={parseFloat(inputs.longitude)} />
                        <LocationPicker
                            setLatitude={(lat) => setInputs((prev) => ({ ...prev, latitude: lat }))}
                            setLongitude={(lng) => setInputs((prev) => ({ ...prev, longitude: lng }))}
                        />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
