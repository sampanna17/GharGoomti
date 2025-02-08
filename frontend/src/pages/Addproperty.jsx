import { useState } from "react";
import FloatingLabelInput from "../components/FloatingLabel";

const formatNumber = (value) => {
    if (!value) return "";
    const num = value.toString().replace(/\D/g, "");
    return new Intl.NumberFormat("en-IN").format(num);
};

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

    const removeFile = (index) => {
        const updatedImages = inputs.images.filter((_, i) => i !== index);
        setInputs({ ...inputs, images: updatedImages });
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
                <div className="col-span-2">
                    <label className="block mb-2 font-medium">Upload Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="block w-full border p-2 rounded"
                    />
                </div>

                {/* File Preview Section */}
                {inputs.images.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-medium mb-2">Selected Files:</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {inputs.images.map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="Preview"
                                        className="w-full h-32 object-cover rounded border border-gray-300"
                                    />
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
