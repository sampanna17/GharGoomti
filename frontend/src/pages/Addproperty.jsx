import { useState, useEffect } from "react";
import FloatingLabelInput from "../components/FloatingLabel";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const formatNumber = (value) => {
    if (!value) return "";
    const num = value.toString().replace(/\D/g, "");
    return new Intl.NumberFormat("en-IN").format(num);
};

function LocationPicker({ setLatitude, setLongitude }) {
    useMapEvents({
        click(e) {
            setLatitude(e.latlng.lat);
            setLongitude(e.latlng.lng);
        },
    });
    return null;
}

function MapUpdater({ latitude, longitude }) {
    const map = useMap();

    useEffect(() => {
        if (latitude && longitude) {
            map.setView([latitude, longitude], 15);
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
        utilities: "",
        petPolicy: "",
        income: "",
        size: "",
    });

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handlePriceChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, "");
        setInputs({ ...inputs, price: rawValue });
    };

    const handleFileChange = (e) => {
        setInputs({ ...inputs, images: Array.from(e.target.files) });
    };

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg border border-gray-300 mt-32 mb-6 flex">
            {/* Left Side: Grid for Input Fields (60%) */}
            <div className="flex-[60%] pr-4 border-r border-gray-300">
                <div className="grid grid-cols-2 gap-4">
                    <FloatingLabelInput
                        type="text"
                        name="title"
                        id="title"
                        label="Title"
                        value={inputs.title}
                        onChange={handleChange}
                        required
                    />

                    <FloatingLabelInput
                        type="text"
                        name="price"
                        id="price"
                        label="Price"
                        required
                        value={inputs.price ? formatNumber(inputs.price) : ""}
                        onChange={handlePriceChange}
                        className=" "
                    />

                    <FloatingLabelInput
                        type="text"
                        name="address"
                        id="address"
                        label="Address"
                        value={inputs.address}
                        onChange={handleChange}
                        required
                    />

                    <FloatingLabelInput
                        type="text"
                        name="city"
                        id="City"
                        label="City"
                        value={inputs.city}
                        onChange={handleChange}
                        required
                    />

                    <FloatingLabelInput
                        type="number"
                        name="bedroom"
                        id="bedroom"
                        label="Bedrooms"
                        value={inputs.bedroom}
                        onChange={handleChange}
                        required
                    />
                    <FloatingLabelInput
                        type="number"
                        name="bathroom"
                        id="bathroom"
                        label="Bathrooms"
                        value={inputs.bathroom}
                        onChange={handleChange}
                        required
                    />
                    <FloatingLabelInput
                        type="number"
                        name="kitchen"
                        id="kitchen"
                        label="Kitchens"
                        value={inputs.kitchen}
                        onChange={handleChange}
                        required
                    />
                    <FloatingLabelInput
                        type="number"
                        name="hall"
                        id="hall"
                        label="Halls"
                        value={inputs.hall}
                        onChange={handleChange}
                        required
                    />

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

                    <FloatingLabelInput
                        type="number"
                        name="size"
                        id="size"
                        label="Size (sq ft)"
                        value={inputs.size}
                        onChange={handleChange}
                        required
                    />

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

                    <FloatingLabelInput
                        type="text"
                        name="latitude"
                        id="latitude"
                        label="Latitude"
                        value={inputs.latitude}
                        onChange={handleChange}
                        required
                    />

                    <FloatingLabelInput
                        type="text"
                        name="longitude"
                        id="longitude"
                        label="Longitude"
                        value={inputs.longitude}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="desc"
                        placeholder="Description"
                        value={inputs.desc}
                        onChange={handleChange}
                        className="col-span-2 h-20 p-2 border rounded border-gray-300 text-black placeholder-gray-500"
                    ></textarea>

                    <button className="col-span-2 bg-blue-950 text-white p-2 rounded">
                        Submit
                    </button>
                </div>
            </div>

            {/* Right Side: File Upload and Preview (40%) */}
            <div className="flex-[40%] pl-4">
                <div className="col-span-2 h-56">
                    <label className="block mb-2 font-medium">Upload Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="block w-full border p-2 rounded h-48"
                    />
                </div>
                {/* Map Section */}
                <div className="mt-4 ">
                    <h3 className="font-medium mb-2">Select Location</h3>
                    <MapContainer
                        center={[27.707968688566616, 85.31966610552367]}
                        zoom={15}
                        scrollWheelZoom={true}
                        style={{ height: "250px", width: "100%" }}
                        className="rounded"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {inputs.latitude && inputs.longitude && (
                            <Marker position={[inputs.latitude, inputs.longitude]}>
                                <Popup>
                                    Latitude: {inputs.latitude} <br /> Longitude: {inputs.longitude}
                                </Popup>
                            </Marker>
                        )}
                        <MapUpdater latitude={parseFloat(inputs.latitude)} longitude={parseFloat(inputs.longitude)} />
                        <LocationPicker
                            setLatitude={(lat) => setInputs((prev) => ({ ...prev, latitude: lat.toString() }))}
                            setLongitude={(lng) => setInputs((prev) => ({ ...prev, longitude: lng.toString() }))}
                        />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}