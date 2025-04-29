import { useState, useCallback, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaCamera, FaTimes, FaEdit, FaUserTie } from "react-icons/fa";
import { MdSave } from "react-icons/md";
import Sidebar from "../../components/AdminSideBar";
import Navbar from "../../components/AdminNav";
import axios from "axios";
import Cookies from "js-cookie";
import { toast,ToastContainer } from "react-toastify";

const AdminProfile = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        age: "",
        role: ""
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const getAdminData = () => {
        try {
            const adminData = Cookies.get("user_data");
            return adminData ? JSON.parse(adminData) : null;
        } catch (e) {
            console.error("Error parsing admin data:", e);
            return null;
        }
    };

    const adminData = getAdminData();
    const adminId = adminData?.userID;

    const fetchAdminProfile = useCallback(async () => {
        if (!adminId) return;

        try {
            const response = await axios.get(`http://localhost:8000/api/user/${adminId}`);
            if (response.status === 200) {
                const data = response.data;
                setInitialData(data);
                setFormData({
                    firstName: data.userFirstName || "",
                    lastName: data.userLastName || "",
                    email: data.userEmail || "",
                    phone: data.userContact || "",
                    age: data.userAge || "",
                    role: data.role || ""
                });
                setImagePreview(data.profile_picture || null);
            }
        } catch (err) {
            console.error("Error fetching admin data:", err);
            toast.error("Failed to load profile data");
        }
    }, [adminId]);

    useEffect(() => {
        fetchAdminProfile();
    }, [fetchAdminProfile]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            toast.error("Please select a valid image file");
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();

            formDataToSend.append('userFirstName', formData.firstName);
            formDataToSend.append('userLastName', formData.lastName);
            formDataToSend.append('userContact', formData.phone);
            formDataToSend.append('userAge', formData.age);

            // Handle image changes
            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            } else if (!imagePreview) {
                // removing the image
                formDataToSend.append('deleteProfileImage', 'true');
            }

            const response = await axios.put(
                `http://localhost:8000/api/user/${adminId}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 200) {
                toast.success("Profile updated successfully");
                setInitialData(response.data);
                // new profile picture
                if (response.data.profile_picture) {
                    setImagePreview(response.data.profile_picture);
                }
                setSelectedImage(null);
                setIsEditing(false);
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        if (initialData) {
            setFormData({
                firstName: initialData.userFirstName || "",
                lastName: initialData.userLastName || "",
                email: initialData.userEmail || "",
                phone: initialData.userContact || "",
                age: initialData.userAge || "",
                role: initialData.role || ""
            });
            setImagePreview(initialData.profile_picture || null);
        }
    };
    return (
        <div className="flex">
            <ToastContainer position="top-right" autoClose={3000} limit={1} newestOnTop={false} closeOnClick pauseOnHover />
            <Sidebar />
            <div className="flex-1">
                <Navbar
                    firstName={adminData?.userFirstName || formData.firstName}
                    lastName={adminData?.userLastName || formData.lastName}
                />
                <div className="p-6 bg-gray-100 ">
                    {/* Admin Profile Section */}
                    <div className="bg-white rounded-lg shadow-lg p-4 ">
                        <h1 className="text-2xl font-bold text-center mb-6">Admin Profile</h1>

                        <div className="flex justify-center mb-4">
                            {/* Profile Picture */}
                            <div className="relative group">

                                <div className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden bg-gray-100">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUser className="text-4xl text-gray-400" />
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <label className="cursor-pointer p-2 text-white hover:text-blue-200 transition-colors">
                                            <FaCamera className="text-2xl" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                        {imagePreview && (
                                            <button
                                                onClick={removeImage}
                                                className="p-2 text-white hover:text-red-200 transition-colors"
                                            >
                                                <FaTimes className="text-xl" />
                                            </button>
                                        )}
                                    </div>
                                )}
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
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-auto p-2 outline-none"
                                        placeholder="Enter your first name"
                                        readOnly={!isEditing}
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
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-2 outline-none"
                                        placeholder="Enter your email"
                                        readOnly
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
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        className="w-full p-2 outline-none"
                                        placeholder="Enter your age"
                                        readOnly={!isEditing}
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
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full p-2 outline-none"
                                        placeholder="Enter your last name"
                                        readOnly={!isEditing}
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
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full p-2 outline-none"
                                        placeholder="Enter your phone number"
                                        readOnly={!isEditing}
                                    />
                                </div>

                                {/* Role */}
                                <label htmlFor="role" className="text-sm font-semibold text-gray-600">
                                    Role
                                </label>
                                <div className="flex items-center border-b border-gray-300 mb-4">
                                    <FaUserTie className="text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full p-2 outline-none"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="mt-0">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full bg-[#2E4156] text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-[#1A2D42] transition"
                                >
                                    <FaEdit className="mr-2" /> Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSubmitting}
                                        className="flex-1 bg-[#2E4156] text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-[#1A2D42] transition disabled:opacity-70"
                                    >
                                        <MdSave className="mr-2" /> {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
