// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import FloatingLabelInput from "../components/FloatingLabel";
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import ImageUploader from "../components/ImageUploader";
// import Cookies from 'js-cookie';

// const INITIAL_FORM_STATE = {
//     title: "",
//     price: "",
//     address: "",
//     city: "",
//     latitude: "",
//     longitude: "",
//     bedroom: "",
//     bathroom: "",
//     kitchen: "",
//     hall: "",
//     type: "",
//     property: "",
//     images: [],
//     petPolicy: "",
//     size: "",
//     description: "",
// };

// const PROPERTY_TYPES = ["Apartment", "Building", "Flat"];
// const PROPERTY_FOR = ["Rent", "Sale"];
// const PET_POLICIES = ["Available", "Not Available"];

// function LocationPicker({ setLatitude, setLongitude }) {
//     useMapEvents({
//         click(e) {
//             setLatitude(e.latlng.lat.toFixed(6));
//             setLongitude(e.latlng.lng.toFixed(6));
//         },
//     });
//     return null;
// }

// function MapUpdater({ latitude, longitude }) {
//     const map = useMap();
//     useEffect(() => {
//         if (latitude && longitude) {
//             map.setView([latitude, longitude], 16);
//         }
//     }, [latitude, longitude, map]);
//     return null;
// }

// const formatNumber = (value) => {
//     if (!value) return "";
//     return new Intl.NumberFormat("en-IN").format(value.replace(/\D/g, ""));
// };

// const validateNumber = (value, min, max, fieldName) => {
//     const num = parseInt(value);
//     return isNaN(num) || num < min || num > max
//         ? `Please enter valid numbers for ${fieldName} (${min}-${max})`
//         : null;
// };

// export default function AddProperty() {
//     const [clearImages, setClearImages] = useState(false);
//     const [inputs, setInputs] = useState(INITIAL_FORM_STATE);
//     const [authStatus, setAuthStatus] = useState({
//         isLoggedIn: false,
//         isSeller: false,
//         isLoading: true
//     });
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const navigate = useNavigate();

//     // Authentication check
//     useEffect(() => {
//         const checkAuth = () => {
//             const userData = Cookies.get('user_data');

//             if (!userData) {
//                 setAuthStatus({
//                     isLoggedIn: false,
//                     isSeller: false,
//                     isLoading: false
//                 });
//                 return;
//             }

//             try {
//                 const parsedUser = JSON.parse(userData);
//                 const isSeller = parsedUser?.role === 'seller';

//                 setAuthStatus({
//                     isLoggedIn: true,
//                     isSeller,
//                     isLoading: false
//                 });

//                 if (!isSeller) {
//                     toast.error("You need seller privileges to access this page");
//                 }
//             } catch (error) {
//                 console.error('Error parsing user data:', error);
//                 setAuthStatus({
//                     isLoggedIn: false,
//                     isSeller: false,
//                     isLoading: false
//                 });
//                 toast.error("Invalid session data");
//             }
//         };

//         checkAuth();
//     }, []);

//     // Handlers
//     const handleImagesUploaded = (newImages) => {
//         setInputs(prev => ({ ...prev, images: newImages }));
//     };

//     const handleChange = (e) => {
//         let { name, value } = e.target;

//         if (name === "latitude" || name === "longitude") {
//             value = value.replace(/[^0-9.-]/g, "");
//             if (value) value = parseFloat(value).toFixed(6);
//         } else if (name === "price") {
//             value = value.replace(/[^0-9.]/g, "");
//         }

//         setInputs(prev => ({ ...prev, [name]: value }));
//     };

//     // Form validation
//     const validateForm = () => {
//         const requiredFields = [
//             'title', 'price', 'address', 'city', 'latitude', 'longitude',
//             'bedroom', 'bathroom', 'kitchen', 'hall', 'type', 'property',
//             'petPolicy', 'size', 'description'
//         ];

//         // Check required fields
//         const missingField = requiredFields.find(field => !inputs[field]);
//         if (missingField) return "All fields are required.";

//         // Validate numbers
//         const numberValidations = [
//             { field: 'price', min: 0, max: 99999999, message: "Price must be a valid positive number." },
//             { field: 'bedroom', min: 0, max: 25, message: validateNumber(inputs.bedroom, 0, 25, "bedrooms") },
//             { field: 'bathroom', min: 0, max: 20, message: validateNumber(inputs.bathroom, 0, 20, "bathrooms") },
//             { field: 'kitchen', min: 0, max: 5, message: validateNumber(inputs.kitchen, 0, 5, "kitchens") },
//             { field: 'hall', min: 0, max: 10, message: validateNumber(inputs.hall, 0, 10, "halls") },
//             { field: 'size', min: 0, max: 100, message: "Size must be a valid positive number." }
//         ];

//         for (const validation of numberValidations) {
//             const value = inputs[validation.field];
//             const num = parseFloat(value);


//             if (isNaN(num) || num < validation.min || (validation.max && num > validation.max)) {
//                 return validation.message || `Invalid value for ${validation.field}`;
//             }
//         }

//         // Validate dropdowns
//         if (!PROPERTY_TYPES.includes(inputs.type)) {
//             return "Please select a valid property type.";
//         }
//         if (!PROPERTY_FOR.includes(inputs.property)) {
//             return "Please select either Rent or Sale.";
//         }
//         if (!PET_POLICIES.includes(inputs.petPolicy)) {
//             return "Please select a valid pet policy.";
//         }

//         // Validate images
//         if (inputs.images.length < 4) {
//             return "Please upload at least 4 images.";
//         }

//         // Validate description
//         if (inputs.description.length < 10) {
//             return "Description must be at least 10 characters long.";
//         }

//         return null;
//     };

//     // Form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         toast.dismiss();

//         const errorMessage = validateForm();
//         if (errorMessage) {
//             toast.error(errorMessage);
//             return;
//         }

//         if (isSubmitting) return;
//         setIsSubmitting(true);

//         try {
//             const userData = Cookies.get('user_data');
//             const parsedUser = JSON.parse(userData);

//             const propertyData = {
//                 userID: parsedUser.userID,
//                 propertyTitle: inputs.title,
//                 propertyPrice: inputs.price,
//                 propertyAddress: inputs.address,
//                 propertyCity: inputs.city,
//                 bedrooms: parseInt(inputs.bedroom),
//                 bathrooms: parseInt(inputs.bathroom),
//                 kitchens: parseInt(inputs.kitchen),
//                 halls: parseInt(inputs.hall),
//                 propertyType: inputs.type,
//                 propertyFor: inputs.property,
//                 propertySize: parseInt(inputs.size),
//                 petPolicy: inputs.petPolicy,
//                 latitude: inputs.latitude,
//                 longitude: inputs.longitude,
//                 description: inputs.description
//             };

//             const propertyResponse = await axios.post("http://localhost:8000/api/property", propertyData);

//             if (propertyResponse.status === 201) {
//                 const propertyID = propertyResponse.data.propertyID;

//                 // Upload images in parallel
//                 await Promise.all(inputs.images.map(async (image) => {
//                     const formData = new FormData();
//                     formData.append("image", image);
//                     return axios.post(
//                         `http://localhost:8000/api/property/${propertyID}/images`,
//                         formData,
//                         { headers: { "Content-Type": "multipart/form-data" } }
//                     );
//                 }));

//                 toast.success("Property added successfully!");
//                 setInputs(INITIAL_FORM_STATE);
//                 setClearImages(true);
//             } else {
//                 toast.error("Failed to add property.");
//             }
//         } catch (error) {
//             console.error("Error adding property:", error);
//             const errorMessage = error.response?.data?.error || "An error occurred while adding the property.";
//             toast.error(errorMessage);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // Render unauthorized views
//     if (!authStatus.isLoggedIn) {
//         return (
//             <div className="flex flex-col items-center justify-center h-screen text-center">
//                 <p className="text-red-600 text-lg font-semibold mb-4">
//                     You need to login to access this page
//                 </p>
//                 <button
//                     onClick={() => navigate('/login')}
//                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                     Login Now
//                 </button>
//             </div>
//         );
//     }

//     if (!authStatus.isSeller) {
//         return (
//             <div className="flex flex-col items-center justify-center h-screen text-center">
//                 <p className="text-red-600 text-lg font-semibold">
//                     You are not a seller. Request the admin to become a seller.
//                 </p>
//                 <button
//                     onClick={() => navigate('/home')}
//                     className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
//                 >
//                     Go Back to Home
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg border border-gray-300 mt-32 mb-6 flex">
//             <ToastContainer position="top-right" autoClose={3000} limit={1} newestOnTop={false} closeOnClick />

//             {/* Left Side: Form Fields */}
//             <div className="flex-[60%] pr-4 border-r border-gray-300">
//                 <div className="grid grid-cols-2 gap-4">
//                     <FloatingLabelInput name="title" label="Title" value={inputs.title} onChange={handleChange} required />
//                     <FloatingLabelInput name="price" label="Price" value={formatNumber(inputs.price)} onChange={handleChange} required />
//                     <FloatingLabelInput name="address" label="Address" value={inputs.address} onChange={handleChange} required />
//                     <FloatingLabelInput name="city" label="City" value={inputs.city} onChange={handleChange} required />
//                     <FloatingLabelInput name="bedroom" type="number" label="Bedrooms" value={inputs.bedroom} onChange={handleChange} required />
//                     <FloatingLabelInput name="bathroom" type="number" label="Bathrooms" value={inputs.bathroom} onChange={handleChange} required />
//                     <FloatingLabelInput name="kitchen" type="number" label="Kitchens" value={inputs.kitchen} onChange={handleChange} required />
//                     <FloatingLabelInput name="hall" type="number" label="Halls" value={inputs.hall} onChange={handleChange} required />

//                     <select
//                         name="type"
//                         value={inputs.type}
//                         onChange={handleChange}
//                         className={`p-2 border rounded border-gray-300 ${!inputs.type ? "text-gray-500" : "text-black"}`}
//                     >
//                         <option value="" disabled>Select Property Type</option>
//                         {PROPERTY_TYPES.map(type => (
//                             <option key={type} value={type} className="text-black">{type}</option>
//                         ))}
//                     </select>

//                     <select
//                         name="property"
//                         value={inputs.property}
//                         onChange={handleChange}
//                         className={`p-2 border rounded border-gray-300 ${!inputs.property ? "text-gray-500" : "text-black"}`}
//                     >
//                         <option value="" disabled>Select Property For</option>
//                         {PROPERTY_FOR.map(prop => (
//                             <option key={prop} value={prop} className="text-black">{prop}</option>
//                         ))}
//                     </select>

//                     <FloatingLabelInput name="size" type="number" label="Size (sq ft)" value={inputs.size} onChange={handleChange} required />

//                     <select
//                         name="petPolicy"
//                         value={inputs.petPolicy}
//                         onChange={handleChange}
//                         className={`p-2 border rounded border-gray-300 ${!inputs.petPolicy ? "text-gray-500" : "text-black"}`}
//                     >
//                         <option value="" disabled>Pet Policy</option>
//                         {PET_POLICIES.map(policy => (
//                             <option key={policy} value={policy} className="text-black">{policy}</option>
//                         ))}
//                     </select>

//                     <FloatingLabelInput name="latitude" label="Latitude" value={inputs.latitude} onChange={handleChange} required />
//                     <FloatingLabelInput name="longitude" label="Longitude" value={inputs.longitude} onChange={handleChange} required />

//                     <textarea
//                         name="description"
//                         placeholder="Description"
//                         value={inputs.description}
//                         onChange={handleChange}
//                         className="col-span-2 h-20 p-2 border rounded border-gray-300"
//                     />

//                     <button
//                         onClick={handleSubmit}
//                         type="submit"
//                         disabled={isSubmitting}
//                         className="col-span-2 bg-[#2E4156] text-white p-2 rounded hover:bg-[#1A2D42] transition duration-300"
//                     >
//                         {isSubmitting ? "Submitting..." : "Submit"}
//                     </button>
//                 </div>
//             </div>

//             {/* Right Side: Image Uploader & Map */}
//             <div className="flex-[40%] pl-4">
//                 <ImageUploader onImagesUploaded={handleImagesUploaded} clearImages={clearImages} />

//                 {/* Map Section */}
//                 <div className="mt-4">
//                     <h3 className="font-medium mb-2">Select Location</h3>
//                     <MapContainer
//                         center={[27.707968, 85.319666]}
//                         zoom={15}
//                         scrollWheelZoom
//                         style={{ height: "250px", width: "100%" }}
//                         className="rounded z-0"
//                         attributionControl={false}
//                         zoomControl={false}
//                     >
//                         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                         {inputs.latitude && inputs.longitude && (
//                             <Marker position={[parseFloat(inputs.latitude), parseFloat(inputs.longitude)]}>
//                                 <Popup>
//                                     Latitude: {parseFloat(inputs.latitude).toFixed(6)} <br />
//                                     Longitude: {parseFloat(inputs.longitude).toFixed(6)}
//                                 </Popup>
//                             </Marker>
//                         )}
//                         <MapUpdater latitude={parseFloat(inputs.latitude)} longitude={parseFloat(inputs.longitude)} />
//                         <LocationPicker
//                             setLatitude={(lat) => setInputs(prev => ({ ...prev, latitude: lat }))}
//                             setLongitude={(lng) => setInputs(prev => ({ ...prev, longitude: lng }))}
//                         />
//                     </MapContainer>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import FloatingLabelInput from "../components/FloatingLabel";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ImageUploader from "../components/ImageUploader";
import Cookies from 'js-cookie';
import { FaSpinner } from "react-icons/fa";

const INITIAL_FORM_STATE = {
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
    existingImages: [],
    petPolicy: "",
    size: "",
    description: "",
};

const PROPERTY_TYPES = ["Apartment", "Building", "Flat"];
const PROPERTY_FOR = ["Rent", "Sale"];
const PET_POLICIES = ["Available", "Not Available"];

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

const formatNumber = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-IN").format(value.replace(/\D/g, ""));
};

const validateNumber = (value, min, max, fieldName) => {
    const num = parseInt(value);
    return isNaN(num) || num < min || num > max
        ? `Please enter valid numbers for ${fieldName} (${min}-${max})`
        : null;
};

export default function AddProperty() {
    const [clearImages, setClearImages] = useState(false);
    const [inputs, setInputs] = useState(INITIAL_FORM_STATE);
    const [authStatus, setAuthStatus] = useState({
        isLoggedIn: false,
        isSeller: false,
        isLoading: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingProperty, setIsLoadingProperty] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const navigate = useNavigate();
    const { propertyID } = useParams();

    const RequestSellerButton = () => {
        return (
            <button
                onClick={() => navigate('/home')}
                className="group relative mt-4 px-4 py-2 text-black rounded-md overflow-hidden border border-transparent"
            >
                <span className="relative z-10">Request for Seller</span>
    
                {/* Animated outline elements - increased border width to 3px */}
                <span className="absolute left-0 top-0 h-[3px] w-0 bg-blue-900 transition-all duration-300 group-hover:w-full rounded-t-md" />
                <span className="absolute right-0 top-0 h-0 w-[3px] bg-blue-900 transition-all duration-300 group-hover:h-full delay-100 rounded-r-md" />
                <span className="absolute bottom-0 right-0 h-[3px] w-0 bg-blue-900 transition-all duration-300 group-hover:w-full delay-200 rounded-b-md" />
                <span className="absolute bottom-0 left-0 h-0 w-[3px] bg-blue-900 transition-all duration-300 group-hover:h-full delay-300 rounded-l-md" />
            </button>
        );
    };
    

    // Authentication check
    useEffect(() => {
        const checkAuth = () => {
            const userData = Cookies.get('user_data');

            if (!userData) {
                setAuthStatus({
                    isLoggedIn: false,
                    isSeller: false,
                    isLoading: false
                });
                return;
            }

            try {
                const parsedUser = JSON.parse(userData);
                const isSeller = parsedUser?.role === 'seller';

                setAuthStatus({
                    isLoggedIn: true,
                    isSeller,
                    isLoading: false
                });

            } catch (error) {
                console.error('Error parsing user data:', error);
                setAuthStatus({
                    isLoggedIn: false,
                    isSeller: false,
                    isLoading: false
                });
                toast.error("Invalid session data");
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        // Fetch property data for editing
        const fetchPropertyData = async () => {
            setIsLoadingProperty(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/property/${propertyID}`);
                const property = response.data;

                const imagesResponse = await axios.get(`http://localhost:8000/api/property/${propertyID}/images`);
                const propertyImages = imagesResponse.data.map(img => ({
                    imageID: img.imageID,
                    imageUrl: img.imageURL
                }))
                console.log("Fetched images:", propertyImages);

                setInputs({
                    title: property.propertyTitle,
                    price: property.propertyPrice.toString(),
                    address: property.propertyAddress,
                    city: property.propertyCity,
                    latitude: property.latitude.toString(),
                    longitude: property.longitude.toString(),
                    bedroom: property.bedrooms.toString(),
                    bathroom: property.bathrooms.toString(),
                    kitchen: property.kitchens.toString(),
                    hall: property.halls.toString(),
                    type: property.propertyType,
                    property: property.propertyFor,
                    petPolicy: property.petPolicy,
                    size: property.propertySize.toString(),
                    description: property.description,
                    images: [],
                    existingImages: propertyImages
                });

            } catch (error) {
                console.error("Error fetching property:", error);
                toast.error("Failed to load property data");
            } finally {
                setIsLoadingProperty(false);
            }
        };

        if (propertyID) {
            setIsEditMode(true);
            fetchPropertyData();
        }
    }, [propertyID]);

    // Handlers
    const handleImagesUploaded = (newImages) => {
        setInputs(prev => ({ ...prev, images: newImages }));
    };

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "latitude" || name === "longitude") {
            value = value.replace(/[^0-9.-]/g, "");
            if (value) value = parseFloat(value).toFixed(6);
        } else if (name === "price") {
            value = value.replace(/[^0-9.]/g, "");
        }

        setInputs(prev => ({ ...prev, [name]: value }));
    };

    // Form validation
    const validateForm = () => {
        const requiredFields = [
            'title', 'price', 'address', 'city', 'latitude', 'longitude',
            'bedroom', 'bathroom', 'kitchen', 'hall', 'type', 'property',
            'petPolicy', 'size', 'description'
        ];

        // Check required fields
        const missingField = requiredFields.find(field => !inputs[field]);
        if (missingField) return "All fields are required.";

        // Validate numbers
        const numberValidations = [
            { field: 'price', min: 0, max: 99999999, message: "Price must be a valid positive number." },
            { field: 'bedroom', min: 0, max: 25, message: validateNumber(inputs.bedroom, 0, 25, "bedrooms") },
            { field: 'bathroom', min: 0, max: 20, message: validateNumber(inputs.bathroom, 0, 20, "bathrooms") },
            { field: 'kitchen', min: 0, max: 5, message: validateNumber(inputs.kitchen, 0, 5, "kitchens") },
            { field: 'hall', min: 0, max: 10, message: validateNumber(inputs.hall, 0, 10, "halls") },
            { field: 'size', min: 0, max: 100, message: "Size must be a valid positive number." }
        ];

        for (const validation of numberValidations) {
            const value = inputs[validation.field];
            const num = parseFloat(value);

            if (isNaN(num) || num < validation.min || (validation.max && num > validation.max)) {
                return validation.message || `Invalid value for ${validation.field}`;
            }
        }

        // Validate dropdowns
        if (!PROPERTY_TYPES.includes(inputs.type)) {
            return "Please select a valid property type.";
        }
        if (!PROPERTY_FOR.includes(inputs.property)) {
            return "Please select either Rent or Sale.";
        }
        if (!PET_POLICIES.includes(inputs.petPolicy)) {
            return "Please select a valid pet policy.";
        }

        // Validate images (only for new properties)
        if (!isEditMode && inputs.images.length < 4) {
            return "Please upload at least 4 images.";
        }

        // Validate description
        if (inputs.description.length < 10) {
            return "Description must be at least 10 characters long.";
        }

        return null;
    };

    // Handle image deletion
    const handleDeleteImage = async (imageId) => {
        try {
            await axios.delete(`http://localhost:8000/api/property/${propertyID}/images/${imageId}`);
            setInputs(prev => ({
                ...prev,
                existingImages: prev.existingImages.filter(img => img.imageID !== imageId)  // Changed from _id to imageID
            }));
            toast.success("Image deleted successfully");
        } catch (error) {
            console.error("Error deleting image:", error);
            toast.error("Failed to delete image");
        }
    };

    // Form submission
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
            const userData = Cookies.get('user_data');
            const parsedUser = JSON.parse(userData);

            const propertyData = {
                userID: parsedUser.userID,
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

            if (isEditMode) {
                // Update existing property
                await axios.put(`http://localhost:8000/api/property/${propertyID}`, propertyData);

                // Upload new images if any
                if (inputs.images.length > 0) {
                    await Promise.all(inputs.images.map(async (image) => {
                        const formData = new FormData();
                        formData.append("image", image);
                        return axios.post(
                            `http://localhost:8000/api/property/${propertyID}/images`,
                            formData,
                            { headers: { "Content-Type": "multipart/form-data" } }
                        );
                    }));
                }

                toast.success("Property updated successfully!");
                navigate('/profile', { state: { activeTab: 'listing' } });
            } else {
                const propertyResponse = await axios.post("http://localhost:8000/api/property", propertyData);

                if (propertyResponse.status === 201) {
                    const newPropertyID = propertyResponse.data.propertyID;

                    // Upload images in parallel
                    await Promise.all(inputs.images.map(async (image) => {
                        const formData = new FormData();
                        formData.append("image", image);
                        return axios.post(
                            `http://localhost:8000/api/property/${newPropertyID}/images`,
                            formData,
                            { headers: { "Content-Type": "multipart/form-data" } }
                        );
                    }));

                    toast.success("Property added successfully!");
                    setInputs(INITIAL_FORM_STATE);
                    setClearImages(true);
                }
            }
        } catch (error) {
            console.error("Error saving property:", error);
            const errorMessage = error.response?.data?.error || "An error occurred while saving the property.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!authStatus.isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <p className="text-red-600 text-lg font-semibold mb-4">
                    You need to login to access this page
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Login Now
                </button>
            </div>
        );
    }

    if (!authStatus.isSeller) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <p className="text-red-600 text-lg font-semibold">
                    You are not a seller. Request the admin to become a seller.
                </p>
                <RequestSellerButton />
            </div>
        );
    }

    if (isLoadingProperty) {
        return (
            <div className="flex items-center justify-center h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
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
                        className={`p-2 border rounded border-gray-300 ${!inputs.type ? "text-gray-500" : "text-black"}`}
                    >
                        <option value="" disabled>Select Property Type</option>
                        {PROPERTY_TYPES.map(type => (
                            <option key={type} value={type} className="text-black">{type}</option>
                        ))}
                    </select>

                    <select
                        name="property"
                        value={inputs.property}
                        onChange={handleChange}
                        className={`p-2 border rounded border-gray-300 ${!inputs.property ? "text-gray-500" : "text-black"}`}
                    >
                        <option value="" disabled>Select Property For</option>
                        {PROPERTY_FOR.map(prop => (
                            <option key={prop} value={prop} className="text-black">{prop}</option>
                        ))}
                    </select>

                    <FloatingLabelInput name="size" type="number" label="Size (sq ft)" value={inputs.size} onChange={handleChange} required />

                    <select
                        name="petPolicy"
                        value={inputs.petPolicy}
                        onChange={handleChange}
                        className={`p-2 border rounded border-gray-300 ${!inputs.petPolicy ? "text-gray-500" : "text-black"}`}
                    >
                        <option value="" disabled>Pet Policy</option>
                        {PET_POLICIES.map(policy => (
                            <option key={policy} value={policy} className="text-black">{policy}</option>
                        ))}
                    </select>

                    <FloatingLabelInput name="latitude" label="Latitude" value={inputs.latitude} onChange={handleChange} required />
                    <FloatingLabelInput name="longitude" label="Longitude" value={inputs.longitude} onChange={handleChange} required />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={inputs.description}
                        onChange={handleChange}
                        className="col-span-2 h-20 p-2 border rounded border-gray-300"
                    />

                    <button
                        onClick={handleSubmit}
                        type="submit"
                        disabled={isSubmitting}
                        className="col-span-2 bg-[#2E4156] text-white p-2 rounded hover:bg-[#1A2D42] transition duration-300"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <FaSpinner className="animate-spin mr-2" />
                                {isEditMode ? "Updating..." : "Submitting..."}
                            </span>
                        ) : isEditMode ? "Update Property" : "Submit"}
                    </button>
                </div>
            </div>

            {/* Right Side: Image Uploader & Map */}
            <div className="flex-[40%] pl-4">
                <h2 className="text-xl mb-4 ">
                    {isEditMode ? "Edit Property" : "Add New Property"}
                </h2>
                <ImageUploader
                    onImagesUploaded={handleImagesUploaded}
                    clearImages={clearImages}
                    existingImages={inputs.existingImages}
                    onDeleteImage={isEditMode ? handleDeleteImage : null}
                />

                {/* Map Section */}
                <div className="mt-4">
                    <h3 className="font-medium mb-2">Select Location</h3>
                    <MapContainer
                        center={inputs.latitude && inputs.longitude ?
                            [parseFloat(inputs.latitude), parseFloat(inputs.longitude)] :
                            [27.707968, 85.319666]}
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
                            setLatitude={(lat) => setInputs(prev => ({ ...prev, latitude: lat }))}
                            setLongitude={(lng) => setInputs(prev => ({ ...prev, longitude: lng }))}
                        />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}



