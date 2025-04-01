import { useState, useEffect, useContext } from "react";
import { AuthContext } from '../context/AuthContext';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
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
        petPolicy: "",
        size: "",
        description: "",
    });
    const { user } = useContext(AuthContext);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImagesUploaded = (newImages) => {
        setInputs((prev) => ({ ...prev, images: newImages }));
    };

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === "latitude" || name === "longitude") {
            value = value.replace(/[^0-9.-]/g, "");
            if (value) value = parseFloat(value).toFixed(6);
        }

        if (name === "price") {
            value = value.replace(/[^0-9.]/g, "");
        }

        setInputs((prev) => ({ ...prev, [name]: value }));
    };

    // Validate form data
    const validateForm = () => {
        const {
            title,
            price,
            address,
            city,
            latitude,
            longitude,
            bedroom,
            bathroom,
            kitchen,
            hall,
            type,
            property,
            images,
            petPolicy,
            size,
            description,
        } = inputs;

        // Check if all fields are filled
        if (
            !title ||
            !price ||
            !address ||
            !city ||
            !latitude ||
            !longitude ||
            !bedroom ||
            !bathroom ||
            !kitchen ||
            !hall ||
            !type ||
            !property ||
            !description ||
            !petPolicy ||
            !size
        ) {
            return "All fields are required.";
        }

        // Validate price
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return "Price must be a valid positive number.";
        }

        // Validate latitude and longitude
        if (
            isNaN(latitude) ||
            latitude < -90 ||
            latitude > 90 ||
            isNaN(longitude) ||
            longitude < -180 ||
            longitude > 180
        ) {
            return "Please enter valid latitude and longitude.";
        }

        // Validate number of rooms
        if (isNaN(bedroom) || bedroom < 0 || bedroom > 25) {
            return "Please enter valid numbers for the bedroom.";
        }

        if (isNaN(bathroom) || bathroom < 0 || bathroom > 20) {
            return "Please enter valid numbers for bathrooms.";
        }

        if (isNaN(kitchen) || kitchen < 0 || kitchen > 5) {
            return "Please enter valid numbers for Kitchen.";
        }

        if (isNaN(hall) || hall < 0 || hall > 10) {
            return "Please enter valid numbers for Hall.";
        }

        // Validate property type
        if (!["Apartment", "Building", "Flat"].includes(type)) {
            return "Please select a valid property type (Apartment, Building, Flat).";
        }

        // Validate property for sale or rent
        if (!["Rent", "Sale"].includes(property)) {
            return "Please select either Rent or Sale.";
        }

        // Validate size
        if (isNaN(size) || parseFloat(size) <= 0) {
            return "Size must be a valid positive number.";
        }

        // Validate pet policy
        if (!["Available", "Not Available"].includes(petPolicy)) {
            return "Please select a valid pet policy.";
        }

        // Validate image upload
        if (images.length === 0 || images.length < 3) {
            return "Please upload at least 3 images.";
        }

        // Validate description length
        if (description.length < 10) {
            return "Description must be at least 10 characters long.";
        }

        return null; // Validation passed
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.dismiss();
        const errorMessage = validateForm();
        if (errorMessage) {
            toast.error(errorMessage);
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // Transform data to match backend expectations
            const propertyData = {
                userID: user.userID,
                propertyTitle: inputs.title,
                propertyPrice: inputs.price,
                propertyAddress: inputs.address,
                propertyCity: inputs.city,
                bedrooms: parseInt(inputs.bedroom),
                bathrooms: parseInt(inputs.bathroom),
                kitchens: parseInt(inputs.kitchen),
                halls: parseInt(inputs.hall),
                propertyType: inputs.type,
                propertyFor: inputs.property,
                propertySize: parseInt(inputs.size),
                petPolicy: inputs.petPolicy,
                latitude: inputs.latitude,
                longitude: inputs.longitude,
                description: inputs.description
            };

            const propertyResponse = await axios.post("http://localhost:8000/api/property", propertyData);

            if (propertyResponse.status === 201) {
                const propertyID = propertyResponse.data.propertyID;

                if (inputs.images.length > 0) {
                    for (const image of inputs.images) {
                        const formData = new FormData();
                        formData.append("image", image);

                        await axios.post(`http://localhost:8000/api/property/${propertyID}/images`, formData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        });
                    }
                }
                toast.success("Property added successfully!");
                setInputs({
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
                    description: "",
                    petPolicy: "",
                    size: "",
                });
            } else {
                toast.error("Failed to add property.");
            }
        } catch (error) {
            console.error("Error adding property:", error);
            const errorMessage = error.response?.data?.error || "An error occurred while adding the property.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user || user.role !== 'seller') {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <p className="text-red-600 text-lg font-semibold">
                    You are not a seller. Request the admin to become a seller.
                </p>
                <button
                    onClick={() => window.location.href = "/home"}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Go Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg border border-gray-300 mt-32 mb-6 flex">
            <ToastContainer position="top-right" autoClose={3000} limit={1} newestOnTop={false} closeOnClick />
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
                        <option value="" disabled>Select Property Type</option>
                        <option value="Apartment" className="text-black">Apartment</option>
                        <option value="Building" className="text-black">Building</option>
                        <option value="Flat" className="text-black">Flat</option>
                    </select>

                    <select
                        name="property"
                        value={inputs.property}
                        onChange={handleChange}
                        className={`p-2 border rounded border-gray-300 ${inputs.property === "" ? "text-gray-500" : "text-black"}`}
                    >
                        <option value="" disabled>Select Property For</option>
                        <option value="Rent" className="text-black">Rent</option>
                        <option value="Sale" className="text-black">Sale</option>
                    </select>

                    <FloatingLabelInput name="size" type="number" label="Size (sq ft)" value={inputs.size} onChange={handleChange} required />

                    <select
                        name="petPolicy"
                        value={inputs.petPolicy}
                        onChange={handleChange}
                        className={`p-2 border rounded border-gray-300 ${inputs.petPolicy === "" ? "text-gray-500" : "text-black"}`}
                    >
                        <option value="" disabled>Pet Policy</option>
                        <option value="Available" className="text-black">Available</option>
                        <option value="Not Available" className="text-black">Not Available</option>
                    </select>

                    <FloatingLabelInput name="latitude" label="Latitude" value={inputs.latitude} onChange={handleChange} required />
                    <FloatingLabelInput name="longitude" label="Longitude" value={inputs.longitude} onChange={handleChange} required />

                    <textarea name="description" placeholder="Description" value={inputs.description} onChange={handleChange} className="col-span-2 h-20 p-2 border rounded border-gray-300"></textarea>

                    <button
                        onClick={handleSubmit}
                        type="submit"
                        disabled={isSubmitting}
                        className="col-span-2 bg-[#2E4156] text-white p-2 rounded hover:bg-[#1A2D42] transition duration-300"
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>

            {/* Right Side: Image Uploader & Map */}
            <div className="flex-[40%] pl-4">
                <ImageUploader onImagesUploaded={handleImagesUploaded} />

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