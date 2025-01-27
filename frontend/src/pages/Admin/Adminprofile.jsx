import { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaCamera } from "react-icons/fa";
import { MdSave } from "react-icons/md";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/AdminNav";

const AdminProfile = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [age, setAge] = useState("");
    const [address, setAddress] = useState("");
    const [profilePicture, setProfilePicture] = useState(
    );

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        alert("Profile Updated Successfully!");
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="p-6 bg-gray-100 ">
                    {/* Admin Profile Section */}
                    <div className="bg-white rounded-lg shadow-lg p-6 ">
                        <h1 className="text-2xl font-bold text-center mb-6">Admin Profile</h1>

                        <div className="flex justify-center mb-4">
                            {/* Profile Picture */}
                            <div className="relative flex justify-center items-center">
                                {profilePicture ? (
                                    <img
                                        src={profilePicture}
                                        alt="Profile Logo"
                                        className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
                                    />
                                ) : (
                                    <div className="w-28 h-28 flex justify-center items-center rounded-full border-4 border-blue-500 bg-blue-100">
                                        <FaUser className="text-4xl text-blue-500" />
                                    </div>
                                )}

                                {/* Profile Picture Change Button */}
                                <label
                                    htmlFor="profilePic"
                                    className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer"
                                >
                                    <FaCamera />
                                </label>
                                <input
                                    type="file"
                                    id="profilePic"
                                    accept="image/*"
                                    onChange={handleProfilePictureChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Two Column Form Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-10 py-10">
                            {/* Left Column */}
                            <div>
                                {/* First Name */}
                                <label htmlFor="firstName" className="text-sm font-semibold text-gray-600">
                                    First Name
                                </label>
                                <div className="flex items-center border-b border-gray-300 mb-4">
                                    <FaUser className="text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-auto p-2 outline-none"
                                        placeholder="Enter your first name"
                                    />
                                </div>

                                {/* Email Address */}
                                <label htmlFor="email" className="text-sm font-semibold text-gray-600">
                                    Email Address
                                </label>
                                <div className="flex items-center border-b border-gray-300 mb-4">
                                    <FaEnvelope className="text-gray-500 mr-2" />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-2 outline-none"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                {/* Age */}
                                <label htmlFor="age" className="text-sm font-semibold text-gray-600">
                                    Age
                                </label>
                                <div className="flex items-center border-b border-gray-300 mb-4">
                                    <FaCalendarAlt className="text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        id="age"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className="w-full p-2 outline-none"
                                        placeholder="Enter your age"
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div>
                                {/* Last Name */}
                                <label htmlFor="lastName" className="text-sm font-semibold text-gray-600">
                                    Last Name
                                </label>
                                <div className="flex items-center border-b border-gray-300 mb-4">
                                    <FaUser className="text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full p-2 outline-none"
                                        placeholder="Enter your last name"
                                    />
                                </div>

                                {/* Phone */}
                                <label htmlFor="phone" className="text-sm font-semibold text-gray-600">
                                    Phone Number
                                </label>
                                <div className="flex items-center border-b border-gray-300 mb-4">
                                    <FaPhone className="text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => {
                                            // Ensure the phone number starts with +977-
                                            if (!e.target.value.startsWith("+977-")) {
                                                setPhone("+977-" + e.target.value.slice(5)); // Keep the user input after +977-
                                            } else {
                                                setPhone(e.target.value);
                                            }
                                        }}
                                        className="w-full p-2 outline-none"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                {/* Address */}
                                <label htmlFor="address" className="text-sm font-semibold text-gray-600">
                                    Address
                                </label>
                                <div className="flex items-center border-b border-gray-300 mb-4">
                                    <FaMapMarkerAlt className="text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        id="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full p-2 outline-none"
                                        placeholder="Enter your address"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="mt-0">
                            <button
                                onClick={handleSave}
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
                            >
                                <MdSave className="mr-2" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
